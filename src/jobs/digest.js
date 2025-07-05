// weeklyDigest.js – Generate weekly UPSC digest PDF & upload to Supabase (Groq-powered)
import 'dotenv/config';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/* ─── ENV / Supabase ─────────────────────────────────── */
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const GROQ_KEY = process.env.GROQ_API_KEY;

/* ─── Date helpers (IST) ─────────────────────────────── */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const nowIST = () => new Date(Date.now() + IST_OFFSET_MS);
const isoDateIST = (d) => new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);

const lastNDatesIST = (n) => {
    const arr = [];
    const base = nowIST();
    for (let i = 1; i <= n; i++) {
        const d = new Date(base);
        d.setDate(d.getDate() - i);
        arr.push(isoDateIST(d));
    }
    return arr;
};

/* ─── Groq summary ───────────────────────────────────── */
const summariseWeek = async (text) => {
    const prompt = `Summarise the following weekly UPSC current-affairs digest in 300-350 words.\nReturn with clear section headings.\n\nDIGEST ARTICLES:\n${text.slice(0, 4096)}`;

    const { data } = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
            max_tokens: 700,
        },
        {
            headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 30_000,
        },
    );

    return data.choices?.[0]?.message?.content?.trim() || '';
};

const pruneOldDigests = async () => {
    const cutoff = new Date(nowIST());
    cutoff.setDate(cutoff.getDate() - 30);

    const { data, error } = await supabase.storage.from('weekly-digests').list('');
    if (error) return console.warn('⚠️  List digests failed:', error.message);

    const toDelete = data.filter((f) => new Date(f.created_at) < cutoff);
    if (!toDelete.length) return;

    for (const f of toDelete) {
        await supabase.storage.from('weekly-digests').remove([f.name]);
        console.log('🗑️  Deleted old digest:', f.name);
    }
};

/* ─── PDF helpers (pure WinAnsi) ─────────────────────── */
const sanitise = (t) =>
    t.replace(/\r?\n/g, ' ') // new lines → space
        .normalize('NFKD')
        .replace(/[^\x00-\x7F]/g, ''); // strip non-ASCII

const wrapLines = (text, font, size, maxWidth) => {
    const words = sanitise(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
        const cand = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(cand, size) < maxWidth) {
            line = cand;
        } else {
            if (line) lines.push(line);
            line = w;
        }
    }
    if (line) lines.push(line);
    return lines;
};

const buildPdf = async (overview, summaries) => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    let page = pdf.addPage();
    const { width, height } = page.getSize();
    const margin = 30;
    let y = height - margin;

    const draw = (txt, size = 12) => {
        const lines = wrapLines(txt, font, size, width - 2 * margin);
        for (const line of lines) {
            if (y < 60) {
                page = pdf.addPage();
                y = page.getHeight() - margin;
            }
            page.drawText(line, { x: margin, y, size, font, color: rgb(0, 0, 0) });
            y -= size + 4;
        }
        y -= 8;
    };

    draw('Weekly UPSC Digest', 18);
    draw(overview, 12);

    for (const { title, body, date } of summaries) {
        draw(`\n${date} – ${title}`, 14);
        draw(body, 11);
    }

    return pdf.save();
};

/* ─── Main routine ───────────────────────────────────── */
export default async function runDigest() {
    console.log('🟢 Weekly digest started', nowIST().toISOString());
    await pruneOldDigests();
    const dates = lastNDatesIST(7);

    const { data: summaries, error } = await supabase
        .from('summaries')
        .select('title, body, date')
        .in('date', dates)
        .order('date', { ascending: true });

    if (error) {
        console.error('❌ Supabase fetch failed:', error.message);
        return;
    }
     console.log('🔍 Found', summaries.length, 'summaries for digest');

    const concat = summaries.map((s) => `${s.title}: ${s.body}`).join('\n');
    const overview = await summariseWeek(concat);

    if (!overview) {
        console.error('❌ Groq returned empty overview');
        return;
    }

    console.log('🔍 Overview generated:', overview.slice(0, 100), '...');

    const pdfBytes = await buildPdf(overview, summaries);
    const fileName = `${dates.at(-1)}_to_${dates[0]}_digest.pdf`;

    console.log('📄 PDF generated:', fileName);

    const { error: upErr } = await supabase.storage
        .from('weekly-digests')
        .upload(fileName, new Uint8Array(pdfBytes), {
            upsert: true,
            contentType: 'application/pdf',
        });

    if (upErr) console.error('❌ Upload error:', upErr.message);
    else console.log('✅ Digest uploaded →', fileName);
}

if (import.meta.url === `file://${process.argv[1]}`) runDigest();
// src/jobs/ingest.js
import 'dotenv/config';
import axios from 'axios';
import RSSParser from 'rss-parser';
import { extract } from '@extractus/article-extractor';
import { convert } from 'html-to-text';
import { createClient } from '@supabase/supabase-js';
import { UPSC_TOPICS, NEWS_API_SOURCES, RSS_FEEDS, SUM_MODEL } from '../constants.js';
import { getYesterdayIST } from '../utils.js';

/* ─── Supabase ─────────────────────────── */
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ─── Hugging Face summariser ───────────── */
const HF = axios.create({
    baseURL: 'https://api-inference.huggingface.co/models',
    headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
    timeout: 15_000
});

/* ─── Utility ───────────────────────────── */

const findUPSCTags = (text) => {
    const matches = [];
    const normalized = text.toLowerCase();
    for (const [topic, keywords] of Object.entries(UPSC_TOPICS)) {
        for (const keyword of keywords) {
            const normalizedKeyword = keyword.toLowerCase();
            const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'i');
            if (regex.test(normalized)) {
                matches.push(topic);
                break;
            }
        }
    }
    return [...new Set(matches)].slice(0, 3);
};

/* ─── Sources ───────────────────────────── */
const newsApiArticles = async () => {
    const YESTERDAY = getYesterdayIST();
    try {
        const { data: { articles = [] } = {} } = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                sources: NEWS_API_SOURCES.join(','),
                from: YESTERDAY,
                to: YESTERDAY,
                sortBy: 'publishedAt',
                pageSize: 25,
                apiKey: process.env.NEWSAPI_KEY,
            },
            timeout: 12_000
        });
        return articles
            .filter(a => a.url && !a.url.includes('google.com'))
            .map(a => ({ title: a.title, link: a.url }));
    } catch {
        return [];
    }
};

const rssArticles = async () => {
    const parser = new RSSParser();
    const yest = new Date(getYesterdayIST()).toDateString();
    const arr = [];

    for (const url of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(url);
            feed.items
                .filter(i => new Date(i.pubDate || i.isoDate || 0).toDateString() === yest)
                .forEach(i => i.link && arr.push({ title: i.title, link: i.link }));
        } catch {}
    }

    return arr;
};

/* ─── Summariser ───────────────────────── */
const summarise = async (html) => {
    const plain = convert(html, {
        wordwrap: false,
        selectors: [{ selector: 'img', format: 'skip' }]
    }).replace(/\s+/g, ' ').slice(0, 1000);

    if (plain.length < 120) return '';
    try {
        const { data } = await HF.post(`/${SUM_MODEL}`, { inputs: plain });
        return Array.isArray(data) && data[0]?.summary_text ? data[0].summary_text : '';
    } catch {
        return '';
    }
};

/* ─── Delete Old Summaries ─────────────── */
const deleteOldSummaries = async () => {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1_000).toISOString().slice(0, 10);
    const { data: bookmarkedRows, error: bookmarkErr } = await supabase
        .from('bookmarks')
        .select('summary_id');

    if (bookmarkErr) {
        console.error('❌ Could not fetch bookmarks:', bookmarkErr.message);
        return bookmarkErr;
    }

    const bookmarkedIds = bookmarkedRows.map(r => r.summary_id);
    let delQuery = supabase.from('summaries').delete().lt('date', cutoff);

    if (bookmarkedIds.length) {
        delQuery = delQuery.not('id', 'in', `(${bookmarkedIds.join(',')})`);
    }

    const { error: delError } = await delQuery;
    if (delError) {
        return delError;
    } else {
        console.log('🗑️  Old un-bookmarked summaries pruned');
        return null;
    }
};

/* ─── Main ─────────────────────────────── */
const runIngest = async () => {
    const YESTERDAY = getYesterdayIST();
    console.log('🟢 ingest started for', getYesterdayIST());

    console.log('Deleting old summaries...');
    const delError = await deleteOldSummaries();
    if (delError) {
        console.error('❌ Supabase delete error:', delError.message);
        return;
    }
    
    const summarizedArticlesLength = 0;

    const articles = [...await newsApiArticles(), ...await rssArticles()].slice(0, 150);
    console.log('articles fetched:', articles.length);

    for (const art of articles) {
        try {
            const page = await extract(art.link, { timeout: 15000 });
            if (!page?.content) continue;

            const summary = await summarise(page.content);
            if (summary.length < 50) continue;

            const tags = findUPSCTags(`${art.title} ${summary}`);
            if (tags.length === 0) {
                console.log('⏭️ skip (non-UPSC):', art.title);
                continue;
            }
            
            summarizedArticlesLength++;
            if (summarizedArticlesLength > 100) {
                console.log('🟢 Ingest limit reached, stopping...');
                break;
            }

            const row = {
                title: art.title,
                body: summary,
                tags,
                source_url: art.link,
                date: YESTERDAY
            };

            const { error } = await supabase.from('summaries').upsert(row, {
                onConflict: 'source_url'
            });

            error
                ? console.error('❌ Supabase:', error.message)
                : console.log('✅', art.title.slice(0, 60), '|', tags.join(', '));
        } catch {
            /* skip bad articles */
        }
    }
    console.log('🟢 Ingest completed for', YESTERDAY);
};

export default runIngest;

if (import.meta.url === `file://${process.argv[1]}`) runIngest();
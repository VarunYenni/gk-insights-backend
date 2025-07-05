import 'dotenv/config';
import express from 'express';
import runIngest from './jobs/ingest.js';
import runQuiz from './jobs/quiz.js';
import runDigest from './jobs/digest.js';

const app = express();

// manual trigger endpoints
app.get('/ingest', async (_, res) => { await runIngest(); res.json({ ok: true }); });
app.get('/quiz',   async (_, res) => { await runQuiz();   res.json({ ok: true }); });
app.get('/digest', async (_, res) => { await runDigest(); res.json({ ok: true }); });

/* ───────────── CRON tasks (server keeps running) ───────────── */

// cron.schedule('30 1 * * *',  runIngest);          // 06:30 IST daily
// cron.schedule('35 1 * * *',  runQuiz);            // five min after ingest
// cron.schedule('40 1 * * 0',  runDigest);          // Sundays 06:40 IST

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`💚 Backend live on ${PORT}`));
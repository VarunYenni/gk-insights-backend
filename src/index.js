import 'dotenv/config';
import express from 'express';
import runIngest from './jobs/ingest.js';
import runQuiz from './jobs/quiz.js';
import runDigest from './jobs/digest.js';

const app = express();

app.get('/ingest', async (_, res) => { await runIngest(); res.json({ ok: true }); });
app.get('/quiz',   async (_, res) => { await runQuiz();   res.json({ ok: true }); });
app.get('/digest', async (_, res) => { await runDigest(); res.json({ ok: true }); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`💚 Backend live on ${PORT}`);
});
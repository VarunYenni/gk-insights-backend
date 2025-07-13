import 'dotenv/config';
import express from 'express';
import runIngest from './jobs/ingest.js';
import runQuiz from './jobs/quiz.js';
import runDigest from './jobs/digest.js';

const app = express();

app.use(express.json());

const requireAuthHeader = (req, res, next) => {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== process.env.CRON_SECRET) {
        return res.status(403).send('Forbidden');
    }
    next();
};

app.get('/ingest', requireAuthHeader, async (req, res) => {
    await runIngest();
    res.send('Ingest done');
});

app.get('/quiz', requireAuthHeader, async (req, res) => {
    await runQuiz();
    res.send('Quiz done');
});

app.get('/digest', requireAuthHeader, async (req, res) => {
    await runDigest();
    res.send('Digest done');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`💚 Backend live on ${PORT}`));
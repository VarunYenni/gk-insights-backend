// src/jobs/quiz.js
import 'dotenv/config';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { YESTERDAY } from '../utils.js';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const prompt = (summary) => `
You are an API generating UPSC-style multiple choice questions.

Your task:
- Generate 2 MCQs from the text below.
- Each question must have 4 options.
- Only one correct answer per question.

Return ONLY a raw JSON array. Do NOT add any explanations, headings, or markdown.

Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": 2
  }
]

TEXT:
${summary}
`;

const runQuiz = async () => {
    await supabase.from('quizzes').delete().neq('date', YESTERDAY);
    console.log('🟢 Old quiz cleared');
    console.log('🟢 quiz started for', YESTERDAY);

    const { data: summaries, error } = await supabase
        .from('summaries')
        .select('body')
        .eq('date', YESTERDAY)
        .limit(50);
    if (error) {
        console.error('❌ Supabase fetch error:', error.message);
        return;
    }

    console.log('🟢 Fetched', summaries?.length, 'summaries for quiz');

    if (!summaries?.length) return;

    console.log('🔍 Found', summaries.length, 'summaries for quiz');

    const allQs = [];

    for (const { body } of summaries) {
        try {
            const res = await openai.chat.completions.create({
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'user',
                        content: prompt(body),
                    },
                ],
            });

            let output = res.choices?.[0]?.message?.content?.trim();
            try {
                const questions = JSON.parse(output);
                const isValidQuestion = true;
                // Validate structure
                for (const q of questions) {
                    if (
                        !q.question ||
                        !Array.isArray(q.options) ||
                        q.options.length !== 4 ||
                        q.correct_answer === undefined ||
                        typeof q.correct_answer !== 'number' ||
                        q.correct_answer < 0 ||
                        q.correct_answer > 3
                    ) {
                        isValidQuestion = false;
                    }
                }
                if (isValidQuestion) {
                    allQs.push(...questions);
                    console.log('question generated for summary', allQs.length/2);
                } else {
                    console.warn('⚠️ Invalid question format');
                }
            } catch (err) {
                // Fallback: try to extract JSON block
                const match = output.match(/\[.*\]/s);
                if (match) {
                    try {
                        const fallbackParsed = JSON.parse(match[0]);
                        allQs.push(...fallbackParsed);
                    } catch {
                        console.warn('⚠️ Fallback parse failed');
                    }
                } else {
                    console.warn('⚠️ Invalid response, could not extract JSON');
                }
            }
        } catch (err) {
            console.warn('⚠️  Generation failed:', err.message);
        }
    }

    if (!allQs.length) return;
    console.log('📝 Generated', allQs.length, 'questions');

    const { error: upsertError } = await supabase
        .from('quizzes')
        .insert({ date: YESTERDAY, questions: allQs });

    if (upsertError) console.error('❌ Supabase insert error:', upsertError.message);
    else console.log('✅ Quiz saved with', allQs.length, 'questions');
};

export default runQuiz;

if (import.meta.url === `file://${process.argv[1]}`) runQuiz();
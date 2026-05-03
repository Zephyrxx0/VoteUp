import express from 'express';
import { streamQA } from '../services/gemini.ts';

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { homeCountry, newCountry, language, messages, activeStageId } = req.body;
  
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  const prompt = messages[messages.length - 1].content;
  const context = `
    User is moving from ${homeCountry} to ${newCountry}.
    They are currently at the election stage: ${activeStageId}.
    Their preferred language is: ${language}.
    Conversation history: ${messages.map((m: any) => `${m.role}: ${m.content}`).join('\n')}
  `;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await streamQA(prompt, context, (token) => {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    });
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('QA stream error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to stream answer' })}\n\n`);
    res.end();
  }
});

export default router;


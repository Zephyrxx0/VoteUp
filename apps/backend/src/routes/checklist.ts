import express from 'express';
import { TemplateProvider } from '../services/checklist/template-provider.ts';
import { AICustomizer } from '../services/checklist/ai-customizer.ts';

const router = express.Router();
const templateProvider = new TemplateProvider();
const aiCustomizer = new AICustomizer();

const CUSTOMIZE_WINDOW_MS = 15 * 60 * 1000;
const CUSTOMIZE_LIMIT = 10;
const customizeRateLimit = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = customizeRateLimit.get(key);
  if (!current || now - current.windowStart > CUSTOMIZE_WINDOW_MS) {
    customizeRateLimit.set(key, { count: 1, windowStart: now });
    return false;
  }

  if (current.count >= CUSTOMIZE_LIMIT) {
    return true;
  }

  current.count += 1;
  customizeRateLimit.set(key, current);
  return false;
}

router.get('/api/checklist/templates/:stage', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const stageParam = Number(req.params.stage);
  if (!Number.isInteger(stageParam) || stageParam < 1 || stageParam > 8) {
    return res.status(400).json({
      error: 'Invalid stage parameter',
      message: 'stage must be an integer between 1 and 8',
    });
  }

  try {
    const template = templateProvider.getTemplate(stageParam);
    return res.json(template);
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid stage parameter',
      message: error instanceof Error ? error.message : 'Unable to fetch template',
    });
  }
});

router.post('/api/checklist/customize', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const { stage, constituency } = req.body as { stage?: number; constituency?: string };
  if (!Number.isInteger(stage) || (stage as number) < 1 || (stage as number) > 8) {
    return res.status(400).json({
      error: 'Invalid stage parameter',
      message: 'stage must be an integer between 1 and 8',
    });
  }

  if (typeof constituency !== 'string' || constituency.trim().length < 3) {
    return res.status(400).json({
      error: 'Invalid constituency parameter',
      message: 'constituency must be a non-empty string with at least 3 characters',
    });
  }

  const requesterKey = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(requesterKey)) {
    console.warn('[ChecklistCustomize] Rate limited request', {
      requesterKey,
      stage,
      constituency,
    });
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many customization requests. Try again later.',
    });
  }

  try {
    const template = templateProvider.getTemplate(stage as number);
    const customized = await aiCustomizer.customize(
      template,
      constituency.trim(),
      stage as number,
    );

    console.info('[ChecklistCustomize] AI customization request handled', {
      requesterKey,
      stage,
      constituency: constituency.trim(),
    });

    return res.json(customized);
  } catch (error) {
    return res.status(400).json({
      error: 'Unable to customize checklist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

import express from 'express';
import { TemplateProvider } from '../services/checklist/template-provider.ts';

const router = express.Router();
const templateProvider = new TemplateProvider();

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

export default router;

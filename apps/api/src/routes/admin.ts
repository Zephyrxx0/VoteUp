import express from 'express';
import type { Express } from 'express';
import { createAuthMiddleware } from '../middleware/auth.js';
import { writeAuditLog } from '../services/db/audit-log.js';

const router = express.Router();
const { isAdmin } = createAuthMiddleware();

router.get('/api/admin/constituencies', isAdmin, async (req, res) => {
  try {
    res.json({ 
      message: 'Admin constituencies endpoint - requires Firebase',
      constituencies: [] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
});

router.post('/api/admin/stage', isAdmin, async (req, res) => {
  try {
    const { acId, stage, dateOverrides } = req.body;
    
    if (!acId || !stage) {
      return res.status(400).json({ 
        error: 'Missing acId or stage' 
      });
    }
    
    const adminId = req.headers['x-admin-id'] as string || 'unknown';
    
    await writeAuditLog({
      adminId,
      action: 'update_stage',
      targetId: acId,
      oldValue: null,
      newValue: { stage, ...dateOverrides },
    });
    
    console.log(`[Admin] Would update AC ${acId} to stage: ${stage}`);
    
    res.json({ success: true, acId, stage });
  } catch (error) {
    console.error('Admin update error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;
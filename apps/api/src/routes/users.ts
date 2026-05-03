import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

export default router;
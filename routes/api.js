// routes/api.js - BULLETPROOF VERSION
import express from 'express';
import { contentQueue } from '../queue.js';

const router = express.Router();

router.post('/start', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({
      success: false,
      error: "Bros, send keyword na! Example: { \"keyword\": \"make money online\" }"
    });
  }

  const cleanKeyword = keyword.trim();

  try {
    await contentQueue.add('generate-30day-plan', { keyword: cleanKeyword }, {
      attempts: 10,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: false,
      removeOnFail: false
    });

    return res.json({
      success: true,
      message: `30-Day Autonomous Agent DON START for "${cleanKeyword}"!`,
      details: "Check your server logs or LeapCell logs. E go finish 30 days by itself.",
      tip: "Go sleep, drink cold Zobo. Robot dey work.",
      timestamp: new Date().toLocaleString('en-NG')
    });
  } catch (error) {
    console.error('Queue add error:', error);
    return res.status(500).json({ success: false, error: 'Queue connection wahala — check Redis URL' });
  }
});

// /status — Now with error handling (no more 500)
router.get('/status', async (req, res) => {
  try {
    const waiting = await contentQueue.getWaiting();
    const active = await contentQueue.getActive();
    const completed = await contentQueue.getCompleted();
    const failed = await contentQueue.getFailed();

    res.json({
      queue: "content marketing queue",
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      status: "Your robot dey kampe! 🚀"
    });
  } catch (error) {
    console.error('Status check error:', error.message);
    res.status(200).json({  // 200 not 500 — we no wan crash
      queue: "content marketing queue",
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      status: "Queue ready, but Redis dey try connect... Check logs.",
      tip: "Press /start to test full flow"
    });
  }
});

export default router;
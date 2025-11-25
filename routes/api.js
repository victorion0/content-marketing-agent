// routes/api.js - The START button for your autonomous agent
import express from 'express';
import { contentQueue } from '../queue.js';

const router = express.Router();

// POST /api/start → This one launches the 30-day robot
router.post('/start', async (req, res) => {
  const { keyword } = req.body;

  // Validation
  if (!keyword || keyword.trim() === '') {
    return res.status(400).json({
      success: false,
      error: "Bros, send keyword na! Example: { \"keyword\": \"make money online\" }"
    });
  }

  const cleanKeyword = keyword.trim();

  // Launch the autonomous agent (fire and forget)
  contentQueue.add('generate-30day-plan', { keyword: cleanKeyword }, {
    attempts: 10,                    // If e fail, try 10 times
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: false,         // Keep job history
    removeOnFail: false
  });

  // Immediate sweet response
  return res.json({
    success: true,
    message: `30-Day Autonomous Agent DON START for "${cleanKeyword}"!`,
    details: "Check your server logs or LeapCell logs. E go finish 30 days by itself.",
    tip: "Go sleep, drink cold Zobo. Robot dey work.",
    timestamp: new Date().toLocaleString('en-NG')
  });
});

// Optional: Check queue status (bonus)
router.get('/status', async (req, res) => {
  const waiting = await contentQueue.getWaiting();
  const active = await contentQueue.getActive();
  const completed = await contentQueue.getCompleted();

  res.json({
    queue: "content marketing queue",
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    status: "Your robot dey kampe!"
  });
});

export default router;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'node:worker_threads';
import { generateContent } from './utils/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// API — START ROBOT (direct worker thread)
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword?.trim()) return res.status(400).json({ error: "Send keyword!" });

  const cleanKeyword = keyword.trim();

  // Launch robot in background
  const worker = new Worker(new URL('./workers/robotWorker.js', import.meta.url), {
    workerData: { keyword: cleanKeyword }
  });

  worker.on('error', (err) => console.error('Robot error:', err));
  worker.on('exit', (code) => {
    if (code !== 0) console.error(`Robot stopped with code ${code}`);
  });

  res.json({
    success: true,
    message: `30-Day Robot STARTED for "${cleanKeyword}"! Check logs → it's cooking now!`
  });
});

// SERVE REACT DASHBOARD
const clientPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY CONTENT ROBOT IS LIVE — NO QUEUE, NO CRASH, PURE POWER!');
  console.log(`Dashboard → http://localhost:${PORT}`);
  console.log(`POST /api/start → launch robot\n`);
});
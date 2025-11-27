// server.js - FINAL FULLSTACK VERSION (Dashboard + Robot in ONE link)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Bree from 'bree';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// BREE — OUR NEW LIGHTWEIGHT ROBOT QUEUE (no Redis needed)
const bree = new Bree({
  root: path.join(__dirname, 'jobs'),        // jobs folder
  defaultExtension: 'js'
});

bree.start();

// API — START THE 30-DAY ROBOT
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ error: "Bros, send keyword na!" });
  }

  const cleanKeyword = keyword.trim();
  const jobName = `content-${Date.now()}`;

  await bree.add({
    name: jobName,
    path: path.join(__dirname, 'jobs/contentJob.js'),
    worker: {
      workerData: { keyword: cleanKeyword }
    }
  });

  res.json({
    success: true,
    message: `30-Day Robot DON START for "${cleanKeyword}"! Check logs for progress`,
    tip: "Robot dey cook 30 days content right now"
  });
});

// SERVE REACT DASHBOARD (React build) FROM SAME APP
const clientPath = path.join(__dirname, 'client/dist');

app.use(express.static(clientPath));

// All non-API routes → serve React dashboard
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API not found' });
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY CONTENT ROBOT IS NOW FULLSTACK!');
  console.log(`Dashboard + API → http://localhost:${PORT}`);
  console.log(`POST /api/start to launch robot\n`);
});
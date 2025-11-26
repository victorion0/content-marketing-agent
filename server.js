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

// BREE — THE NEW QUEUE (ZERO CONFIG)
const bree = new Bree({
  jobs: [],
  root: false // we add jobs manually
});

bree.start();

// API TO START 30-DAY ROBOT
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "Send keyword!" });

  await bree.add({
    name: `content-${Date.now()}`,
    path: path.join(__dirname, 'jobs/contentJob.js'),
    data: { keyword },
    timeout: 0,
    worker: { workerData: { keyword } }
  });

  res.json({
    success: true,
    message: `30-Day Robot STARTED for "${keyword}"! Check console/logs`
  });
});

app.get('/', (req, res) => {
  res.send('<h1>30-Day Autonomous Content Agent LIVE!</h1><p>POST to /api/start with { "keyword": "your niche" }</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AGENT LIVE @ http://localhost:${PORT}`);
  console.log('Press /api/start to launch robot');
});
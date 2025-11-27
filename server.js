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

// BREE — ROBOT QUEUE
const bree = new Bree({
  root: path.join(__dirname, 'jobs'),
  defaultExtension: 'js'
});
bree.start();

// API
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword?.trim()) return res.status(400).json({ error: "Keyword needed!" });

  const jobName = `robot-${Date.now()}`;
  await bree.add({
    name: jobName,
    path: path.join(__dirname, 'jobs/contentJob.js'),
    worker: { workerData: { keyword: keyword.trim() } }
  });

  res.json({ 
    success: true, 
    message: `30-Day Robot STARTED for "${keyword.trim()}"!` 
  });
});

app.get('/api', (req, res) => {
  res.json({ message: "API is ALIVE" });
});

// SERVE REACT DASHBOARD — THIS IS THE ONLY WAY THAT WORKS ON LEAPCELL
const clientPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientPath));

// ONLY SERVE index.html on root and ALL other routes — NO app.get('*') EVER
app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY CONTENT ROBOT SAAS IS LIVE AND UNKILLABLE!');
  console.log(`Dashboard → http://localhost:${PORT}`);
  console.log(`API → POST /api/start`);
  console.log(`No more * route = No more crash\n`);
});
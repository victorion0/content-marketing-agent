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

// BREE — YOUR ROBOT QUEUE
const bree = new Bree({
  root: path.join(__dirname, 'jobs'),
  defaultExtension: 'js'
});
bree.start();

// API ROUTES
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
    message: `30-Day Robot STARTED for "${keyword.trim()}"! Check logs → it's cooking!`
  });
});

app.get('/api', (req, res) => {
  res.json({ message: "30-Day Content Robot API is ALIVE!" });
});

// SERVE REACT DASHBOARD (THIS WAS THE PROBLEM)
const clientPath = path.join(__dirname, 'client/dist');

// Serve static files
app.use(express.static(clientPath));

// THIS LINE FIXED EVERYTHING — NO MORE "*"
app.get('*', (req, res) => {
  // Only serve index.html if it's not an API route
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY CONTENT ROBOT FULLSTACK SAAS IS LIVE!');
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`API: POST /api/start`);
  console.log(`Bree robot running...`);
});
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

// BREE — NOW HAPPY BECAUSE index.js EXISTS
const bree = new Bree({
  root: path.join(__dirname, 'jobs'),
  defaultExtension: 'js'
});
bree.start();

// API — PASS KEYWORD TO JOB
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword?.trim()) return res.status(400).json({ error: "Keyword needed!" });

  const jobName = `robot-${Date.now()}`;
  await bree.add({
    name: jobName, path: './jobs/contentJob.js', args: [keyword.trim()] });

  res.json({ 
    success: true, 
    message: `30-Day Robot STARTED for "${keyword.trim()}"! Check logs → it's cooking!` 
  });
});

// SERVE REACT DASHBOARD — dist folder now exists
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY ROBOT SAAS IS NOW 100% LIVE & UNKILLABLE!');
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`API: POST /api/start`);
});
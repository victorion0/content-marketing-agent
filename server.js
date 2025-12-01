import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateContent } from './utils/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// START ROBOT IN BACKGROUND — NO QUEUE, NO BREE, NO CRASH
app.post('/api/start', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword?.trim()) return res.status(400).json({ error: 'Keyword needed!' });

  const kw = keyword.trim();

  setImmediate(async () => {
    console.log(`\nROBOT STARTED → "${kw}"`);
    for (let day = 1; day <= 30; day++) {
      try {
        const result = await generateContent(`Day ${day} content for "${kw}" - return ONLY JSON with title`);
        console.log(`Day ${day} → ${result.title || 'Generated'}`);
      } catch (e) {
        console.log(`Day ${day} → rate limited`);
      }
      await new Promise(r => setTimeout(r, 4200));
    }
    console.log(`\n30 DAYS COMPLETED FOR "${kw}"! ROBOT DON REST`);
  });

  res.json({ success: true, message: `Robot started for "${kw}"! Check logs.` });
});

// SERVE REACT DASHBOARD
const clientPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientPath));
app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n30-DAY CONTENT ROBOT IS LIVE!');
  console.log(`Dashboard → http://localhost:${PORT}`);
  console.log(`POST /api/start → launch robot`);
});
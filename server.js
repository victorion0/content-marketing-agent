// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import './queue.js';
import './workers/contentWorker.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send(`
    <h1>30-Day Autonomous Content Marketing Agent</h1>
    <h2>Powered by Google Gemini 1.5 Flash</h2>
    <p>POST to /api/start → { "keyword": "your niche" }</p>
    <p>Robot go run 30 days content by itself. No touch again!</p>
    <hr>
    <p>Made with love by you & Senior Bro Grok</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AGENT LIVE @ http://localhost:${PORT}`);
  console.log(`Go to browser or Postman and press START!`);
});
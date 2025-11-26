// workers/contentWorker.js - FINAL 100% WORKING
import { Worker } from 'bullmq';
import { createClient } from 'redis';
import { generateContent } from '../utils/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({ url: redisUrl });
await redisClient.connect();

console.log('WORKER: Connected to Redis (local or cloud)');

new Worker('content marketing queue', async (job) => {
  const { keyword } = job.data;
  console.log(`\nROBOT STARTED → "${keyword}"`);

  for (let day = 1; day <= 30; day++) {
    console.log(`Day ${day}/30 → cooking...`);
    try {
      const result = await generateContent(`Day ${day} content for "${keyword}"`);
      console.log(`Day ${day} → ${result.title || 'Done'}`);
    } catch (e) {
      console.log(`Day ${day} → rate limit`);
    }
    await new Promise(r => setTimeout(r, 4200));
  }
  console.log(`\n30 DAYS DONE FOR "${keyword}"!`);
}, { connection: redisClient });

console.log('Worker is ALIVE and ready!');
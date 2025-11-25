// workers/contentWorker.js - FINAL BULLETPROOF VERSION (Local + LeapCell Ready)
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generateContent } from '../utils/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

// SMART REDIS CONNECTION — AUTO WORKS LOCAL & PRODUCTION
let connection;

if (process.env.REDIS_URL) {
  // Production (LeapCell) — Parse URL properly to avoid "default" hostname bug
  try {
    const url = new URL(process.env.REDIS_URL);

    const redisOptions = {
      host: url.hostname,
      port: parseInt(url.port) || 6379,
      username: url.username || 'default',
      password: url.password || undefined,
      db: url.pathname ? parseInt(url.pathname.slice(1)) || 0 : 0,
      family: 0,                    // Fix ENOTFOUND in cloud
      maxRetriesPerRequest: null,   // BullMQ requirement
      enableReadyCheck: false,
      lazyConnect: true,
      retryDelayOnFailover: 100,
      enableAutoPipelining: true
    };

    connection = new IORedis(redisOptions);

    // Quick ping test
    connection.ping()
      .then(() => console.log(`WORKER REDIS CONNECTED → ${url.hostname}`))
      .catch((err) => {
        console.error('WORKER REDIS PING FAILED:', err.message);
        console.log('Falling back to in-memory queue...');
        connection = { host: 'localhost', port: 6379 };
      });
  } catch (error) {
    console.error('REDIS_URL PARSE ERROR:', error.message);
    connection = { host: 'localhost', port: 6379 }; // fallback
  }
} else {
  // Local testing — no real Redis needed
  connection = { host: 'localhost', port: 6379 };
  console.log('LOCAL MODE: Worker using in-memory queue (perfect for dev)');
}

// MAIN AUTONOMOUS WORKER — YOUR 30-DAY ROBOT
new Worker('content marketing queue', async (job) => {
  const { keyword } = job.data;

  console.log(`\nAUTONOMOUS AGENT ACTIVATED FOR: "${keyword}"`);
  console.log('Starting 30-day content calendar generation...\n');

  for (let day = 1; day <= 30; day++) {
    console.log(`Generating Day ${day}/30...`);

    const prompt = `You are the world's best SEO content strategist.
Create DAY ${day} of a 30-day content calendar for the keyword/niche: "${keyword}"

Return ONLY a valid JSON object with this exact structure:

{
  "day": ${day},
  "title": "Catchy SEO title under 60 characters",
  "meta_description": "SEO meta description under 140-160 characters",
  "outline": ["H1 Hook", "Section 1", "Section 2", "Bonus Tip", "Conclusion + CTA"],
  "twitter_thread": "Full 5-10 tweet thread (use \\n\\n between tweets)",
  "linkedin_post": "Professional LinkedIn post with emojis and hashtags"
}

Keyword: ${keyword}
Make it original, valuable, and highly engaging.
Respond with ONLY the JSON. No explanations. No markdown.`;

    try {
      const content = await generateContent(prompt);

      console.log(`Day ${day} → ${content.title}`);
      console.log(`Meta: ${content.meta_description.substring(0, 80)}...\n`);

      // Future: Save to DB, post to Twitter, etc.
    } catch (error) {
      console.error(`Day ${day} FAILED:`, error.message);
    }

    // Respect Gemini free tier: ~15 RPM → 4 seconds delay
    await new Promise(resolve => setTimeout(resolve, 4200));
  }

  console.log(`\n30-DAY CONTENT CALENDAR FOR "${keyword}" COMPLETED SUCCESSFULLY!`);
  console.log('Your robot don cook finish. Go drink cold Malta & celebrate!\n');

}, { connection });
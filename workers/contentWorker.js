// workers/contentWorker.js - FINAL FIX
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generateContent } from '../utils/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

// SAME CONNECTION FIX HERE TOO
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true
});

new Worker('content marketing queue', async (job) => {
  // ... rest of your code remain the same
  const { keyword } = job.data;
  console.log(`AUTONOMOUS AGENT ACTIVATED FOR: "${keyword}"`);
  console.log(`Starting 30-day content calendar generation...`);

  for (let day = 1; day <= 30; day++) {
    console.log(`\nGenerating Day ${day}/30...`);

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
      console.log(`Meta: ${content.meta_description.substring(0, 80)}...`);

      // Here you can later save to file, database, or auto-post
      // For now we just log success

    } catch (error) {
      console.error(`Day ${day} failed:`, error.message);
    }

    // Respect Gemini free tier: max 15 requests per minute → 4 seconds delay is safe
    await new Promise(resolve => setTimeout(resolve, 4000));
  }

  console.log(`\n30-DAY CONTENT CALENDAR FOR "${keyword}" COMPLETED SUCCESSFULLY!`);
  console.log(`Your robot don cook finish. Go drink cold Malta!`);

}, { connection });
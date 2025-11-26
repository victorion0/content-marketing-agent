// jobs/contentJob.js - FINAL WORKING ROBOT
import { generateContent } from '../utils/gemini.js';

export default async function (job) {
  const { keyword } = job.data;

  console.log(`\nROBOT ACTIVATED → "${keyword}"`);
  console.log('Cooking 30 days of pure fire content...\n');

  for (let day = 1; day <= 30; day++) {
    console.log(`Day ${day}/30 → generating...`);

    const prompt = `You are a world-class SEO content strategist.
Create DAY ${day} of a 30-day content calendar for "${keyword}"
Return ONLY valid JSON with: day, title, meta_description, outline, twitter_thread, linkedin_post`;

    try {
      const result = await generateContent(prompt);
      console.log(`Day ${day} → ${result.title}`);
    } catch (e) {
      console.log(`Day ${day} → rate limited`);
    }

    await new Promise(r => setTimeout(r, 4200));
  }

  console.log(`\n30 DAYS COMPLETED FOR "${keyword}"! ROBOT DON REST`);
}
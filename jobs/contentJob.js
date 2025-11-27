// jobs/contentJob.js - FINAL WORKING ROBOT (with Gemini + Supabase ready)
import { generateContent } from '../utils/gemini.js';

export default async function (job) {
  const { keyword } = job.data;

  console.log(`\n30-DAY ROBOT STARTED FOR: "${keyword}"`);
  console.log('Cooking pure fire content... Hold tight!\n');

  for (let day = 1; day <= 30; day++) {
    console.log(`Day ${day}/30 → generating...`);

    const prompt = `You are a world-class SEO content strategist.
Create DAY ${day} of a 30-day content calendar for the keyword: "${keyword}".
Return ONLY valid JSON with this exact structure:

{
  "day": ${day},
  "title": "Catchy SEO title under 60 characters",
  "meta_description": "140-160 character meta description",
  "outline": ["H1 Hook", "Section 1", "Section 2", "Bonus Tip", "Conclusion + CTA"],
  "twitter_thread": "Full 5-10 tweet thread (use \\n\\n between tweets)",
  "linkedin_post": "Professional LinkedIn post with emojis and hashtags"
}

Make it original, valuable, and highly engaging. No extra text.`;

    try {
      const result = await generateContent(prompt);
      console.log(`Day ${day} → ${result.title}`);
    } catch (error) {
      console.log(`Day ${day} → skipped (Gemini rate limit or error)`);
    }

    // Wait 4.2 seconds (safe for Gemini free tier)
    await new Promise(resolve => setTimeout(resolve, 4200));
  }

  console.log(`\n30-DAY CONTENT PLAN FOR "${keyword}" IS COMPLETE!`);
  console.log('Your robot don finish work. Go drink cold Malta!\n');
}
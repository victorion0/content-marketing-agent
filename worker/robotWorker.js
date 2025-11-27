// workers/robotWorker.js
import { parentPort, workerData } from 'node:worker_threads';
import { generateContent } from '../utils/gemini.js';

const { keyword } = workerData;

console.log(`\nROBOT LAUNCHED FOR: "${keyword}"`);
console.log('Generating 30 days of content...\n');

(async () => {
  for (let day = 1; day <= 30; day++) {
    console.log(`Day ${day}/30 → generating...`);
    try {
      const result = await generateContent(`Create DAY ${day} content for "${keyword}" - return ONLY valid JSON with title`);
      console.log(`Day ${day} → ${result.title}`);
    } catch (e) {
      console.log(`Day ${day} → skipped`);
    }
    await new Promise(r => setTimeout(r, 4200));
  }
  console.log(`\n30 DAYS COMPLETED FOR "${keyword}"! ROBOT DON REST`);
  parentPort?.postMessage('done');
})();
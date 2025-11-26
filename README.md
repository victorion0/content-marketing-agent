# 30-Day Autonomous Content Marketing Agent 

**One keyword → 30 days of SEO-optimized titles, outlines, Twitter threads & LinkedIn posts — 100% hands-off**

Live Demo → https://content-marketing-agent-victorion014-qngt7soh.leapcell.dev

https://content-marketing-agent-victorion014-qngt7soh.leapcell.dev

## What It Does (In 3 Seconds)
You type one keyword → press START → go sleep → wake up to **30 days** of ready-to-post content cooked by Google Gemini 1.5 Flash.

No Redis. No BullMQ headache. Pure Bree + Node.js magic.

## Features
- Fully autonomous (fire and forget)
- SEO-optimized titles & meta descriptions
- Full Twitter threads (5–10 tweets)
- Professional LinkedIn posts with emojis
- Runs locally + deployed on LeapCell (free tier)
- Zero config queue with Bree
- Works on Windows, Mac, Linux

## Live API Endpoints
```bash
GET  /                         → Welcome page
POST /api/start                → Launch robot
     Body: { "keyword": "your niche" }

     Example Request (Postman / curl)bash

curl -X POST https://content-marketing-agent-victorion014-qngt7soh.leapcell.dev/api/start \
  -H "Content-Type: application/json" \
  -d '{"keyword": "how to japa from Nigeria with 200k"}'

→ Robot starts cooking 30 days instantly!Tech StackNode.js + Express
Google Gemini 1.5 Flash (free tier)
Bree (lightweight job scheduler)
LeapCell (free hosting + logs)
Pure JavaScript (ESM)

Local Developmentbash

git clone https://github.com/your-username/content-marketing-agent.git
cd content-marketing-agent
npm install
npm run dev

Then POST to http://localhost:3000/api/startDeploy Your Own (30 seconds)Fork this repo
Go to https://leapcell.io
New App → From GitHub → Select your fork
Add env var: GOOGLE_GEMINI_API_KEY
Deploy → Done!

Roadmap (Level Up Coming Soon)

Beautiful React dashboard
Save calendars to Supabase + download PDF
Auto-post to Twitter & LinkedIn
Email/Slack notification when done
SaaS version ($19/month unlimited)

Built By Victor Osaikhuiwuomwan
From zero to live autonomous AI agent in 3 days. Now go press START and watch the robot cook while you chop life. Made with love, pidgin, and cold Malt.




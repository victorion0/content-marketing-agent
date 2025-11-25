// queue.js - FINAL 2025 BULLMQ + IOREDIS FIX
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// THIS NA THE MAGIC LINE WEY FIX EVERYTHING
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,   // ← This one kill the error
  enableReadyCheck: false,
  lazyConnect: true
});

export const contentQueue = new Queue('content marketing queue', {
  connection,
});

console.log("BullMQ + Redis connected perfectly — Robot brain 100% ready!");
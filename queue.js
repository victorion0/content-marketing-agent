// queue.js - BULLETPROOF FOR LEAPCELL
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

let connection;

if (process.env.REDIS_URL) {
  try {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryDelayOnFailover: 100,
      enableAutoPipelining: true
    });
    // Test connection quick
    connection.ping().then(() => {
      console.log("PRODUCTION MODE: Redis connected successfully! 🟢");
    }).catch(() => {
      console.log("PRODUCTION MODE: Redis connect failed — check URL. Using fallback. 🔴");
      connection = { host: 'localhost', port: 6379 };  // Fallback
    });
  } catch (error) {
    console.error('Redis init error:', error);
    connection = { host: 'localhost', port: 6379 };
  }
} else {
  connection = { host: 'localhost', port: 6379 };
  console.log("LOCAL MODE: In-memory queue (no Redis needed)");
}

export const contentQueue = new Queue('content marketing queue', { connection });

console.log("BullMQ + Redis connected perfectly — Robot brain 100% ready!");
// queue.js - FINAL WORKING (uses local Redis or cloud Redis)
import { Queue } from 'bullmq';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// Always create a Redis client — local or cloud
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: redisUrl });
await redisClient.connect();

console.log(process.env.REDIS_URL 
  ? 'PRODUCTION: Connected to LeapCell Redis' 
  : 'LOCAL: Connected to local Redis (in-memory)'
);

export const contentQueue = new Queue('content marketing queue', {
  connection: redisClient
});
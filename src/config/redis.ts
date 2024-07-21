import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: REDIS_URL,
});

(async () => {
  redisClient.on('error', (err) => {
    console.log('Redis Client Error', err);
  });
  redisClient.on('ready', () => console.log('Redis is ready'));

  await redisClient.connect();

  await redisClient.ping();
})();

export default redisClient;

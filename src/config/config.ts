import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10),
  mongodbUrl: process.env.MONGODB_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT, 10),
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10),
  rateLimit: parseInt(process.env.RATE_LIMIT, 10),
});

import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const createCacheConfig = async (configService: ConfigService): Promise<CacheModuleOptions> => {
  const redisUrl = configService.get<string>('REDIS_URL');
  const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
  const redisPort = configService.get<number>('REDIS_PORT') || 6379;
  const redisPassword = configService.get<string>('REDIS_PASSWORD');

  // Try Redis first, fallback to memory cache
  try {
    if (redisUrl || redisHost) {
      console.log(`Attempting to connect to Redis at ${redisUrl || `${redisHost}:${redisPort}`}`);
      
      return {
        store: await redisStore({
          url: redisUrl,
          socket: redisUrl ? undefined : {
            host: redisHost,
            port: redisPort,
            connectTimeout: 5000,
          },
          password: redisPassword,
        }),
        ttl: 300, // 5 minutes default TTL
        max: 1000, // Max items in cache
      };
    }
  } catch (error) {
    console.warn('Redis connection failed, falling back to memory cache:', error.message);
  }

  // Fallback to memory cache
  console.log('Using in-memory cache (no Redis connection)');
  return {
    ttl: 300, // 5 minutes
    max: 100, // Max items in memory cache
  };
};
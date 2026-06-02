import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [
        {
            provide: 'CACHE_CLIENT',
            useFactory: () => {
                const host = process.env.REDIS_HOST;
                const port = Number(process.env.REDIS_PORT ?? 6379);
                if (host) {
                    try {
                        // lazy-require to avoid hard dependency
                        // eslint-disable-next-line @typescript-eslint/no-var-requires
                        const { RedisCacheClient } = require('../cache/redis-cache.client');
                        return new RedisCacheClient(host, port);
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.warn('Redis client build failed, falling back to in-memory cache', e?.message ?? e);
                    }
                }
                // fallback
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { InMemoryCacheClient } = require('../cache/in-memory-cache.client');
                return new InMemoryCacheClient();
            },
        },
    ],
    exports: ['CACHE_CLIENT'],
})
export class CacheModule { }

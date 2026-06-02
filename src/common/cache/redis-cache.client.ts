// Redis-backed cache client. This file requires ioredis at runtime only when used.
import type { CacheClient } from './cache.interface';

export class RedisCacheClient implements CacheClient {
    private client: any;

    constructor(host: string, port = 6379) {
        // require lazily so tests without ioredis don't fail
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const IORedis = require('ioredis');
        this.client = new IORedis({ host, port });
    }

    async get<T = any>(key: string): Promise<T | undefined> {
        const v = await this.client.get(key);
        return v ? JSON.parse(v) : undefined;
    }

    async set<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const s = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.set(key, s, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, s);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async keys(pattern: string): Promise<string[]> {
        return await this.client.keys(pattern);
    }

    async delByPrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length) await this.client.del(...keys);
    }
}

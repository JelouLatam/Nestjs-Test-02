import { CacheClient } from './cache.interface';

type Entry = { value: any; expiresAt?: number };

export class InMemoryCacheClient implements CacheClient {
    private store = new Map<string, Entry>();

    async get<T = any>(key: string): Promise<T | undefined> {
        const e = this.store.get(key);
        if (!e) return undefined;
        if (e.expiresAt && e.expiresAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }
        return e.value as T;
    }

    async set<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        const entry: Entry = { value };
        if (ttlSeconds) entry.expiresAt = Date.now() + ttlSeconds * 1000;
        this.store.set(key, entry);
    }

    async del(key: string): Promise<void> {
        this.store.delete(key);
    }

    async keys(pattern: string): Promise<string[]> {
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        return Array.from(this.store.keys()).filter((k) => regex.test(k));
    }

    async delByPrefix(prefix: string): Promise<void> {
        for (const k of Array.from(this.store.keys())) {
            if (k.startsWith(prefix)) this.store.delete(k);
        }
    }
}

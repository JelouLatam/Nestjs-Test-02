export interface CacheClient {
    get<T = any>(key: string): Promise<T | undefined>;
    set<T = any>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    keys(pattern: string): Promise<string[]>;
    delByPrefix(prefix: string): Promise<void>;
}

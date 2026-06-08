import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      console.warn(`Failed to get cache key ${key}:`, error.message);
      return undefined;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl || 300);
      console.log(`Cached key: ${key}`);
    } catch (error) {
      console.warn(`Failed to set cache key ${key}:`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      console.log(`Deleted cache key: ${key}`);
    } catch (error) {
      console.warn(`Failed to delete cache key ${key}:`, error.message);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // For user-specific cache invalidation
      const keys = await this.getKeysByPattern(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map(key => this.del(key)));
        console.log(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      console.warn(`Failed to invalidate cache pattern ${pattern}:`, error.message);
    }
  }

  async invalidateUserCache(userId: number): Promise<void> {
    await this.invalidatePattern(`*user_${userId}*`);
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      // This is a simplified implementation
      // In production, you might want to use Redis SCAN command
      // For memory cache, this is a basic implementation
      const store = (this.cacheManager as any).store;
      if (store && store.keys) {
        const allKeys = await store.keys();
        return allKeys.filter((key: string) => 
          this.matchPattern(key, pattern)
        );
      }
      return [];
    } catch (error) {
      console.warn('Failed to get keys by pattern:', error.message);
      return [];
    }
  }

  private matchPattern(key: string, pattern: string): boolean {
    // Simple pattern matching with * wildcard
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(`^${regexPattern}$`).test(key);
  }
}
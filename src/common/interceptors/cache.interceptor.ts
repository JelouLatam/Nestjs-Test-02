import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Create cache key including user ID for user-specific data
    const cacheKey = this.generateCacheKey(url, user?.id);
    
    try {
      // Try to get from cache
      const cachedResult = await this.cacheManager.get(cacheKey);
      
      if (cachedResult) {
        console.log(`Cache HIT for key: ${cacheKey}`);
        return of(cachedResult);
      }

      console.log(`Cache MISS for key: ${cacheKey}`);
      
      // If not in cache, execute the handler and cache the result
      return next.handle().pipe(
        tap(async (data) => {
          try {
            // Cache the result with TTL
            await this.cacheManager.set(cacheKey, data, 300); // 5 minutes TTL
            console.log(`Cached result for key: ${cacheKey}`);
          } catch (error) {
            console.warn('Failed to cache result:', error.message);
          }
        }),
      );
    } catch (error) {
      console.warn('Cache operation failed, proceeding without cache:', error.message);
      return next.handle();
    }
  }

  private generateCacheKey(url: string, userId?: number): string {
    const baseKey = `api_cache:${url}`;
    return userId ? `${baseKey}:user_${userId}` : baseKey;
  }
}
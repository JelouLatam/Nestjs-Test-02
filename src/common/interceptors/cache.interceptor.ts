import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import type { CacheClient } from '../cache/cache.interface';
import { Inject, Optional } from '@nestjs/common';
import { InMemoryCacheClient } from '../cache/in-memory-cache.client';

const DEFAULT_TTL = 60; // seconds

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(
        @Optional()
        @Inject('CACHE_CLIENT')
        private cacheClient?: CacheClient,
    ) {
        if (!this.cacheClient) {
            // fallback to in-memory client for tests / missing provider
            this.cacheClient = new InMemoryCacheClient();
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;

        // Only cache GETs
        if (method !== 'GET') {
            return next.handle();
        }

        const key = this.cacheKey(req);

        // Wrap cache get in an observable; on error return undefined so we proceed to handler
        const cacheGet$ = from(this.cacheClient!.get(key)).pipe(
            catchError((err) => {
                try {
                    // eslint-disable-next-line no-console
                    console.warn('[CacheInterceptor] cache get failed:', err?.message ?? err);
                } catch (_) { }
                return of(undefined);
            }),
        );

        return cacheGet$.pipe(
            switchMap((cached) => {
                // treat both undefined and null as cache miss
                if (cached !== undefined && cached !== null) {
                    // if cache stored JSON strings (e.g. Redis), try to parse
                    if (typeof cached === 'string') {
                        try {
                            return of(JSON.parse(cached));
                        } catch (e) {
                            return of(cached);
                        }
                    }
                    return of(cached);
                }
                return next.handle().pipe(
                    tap((data) => {
                        // attempt to set cache, swallow errors
                        try {
                            // fire-and-forget
                            (this.cacheClient!.set(key, data, DEFAULT_TTL) as Promise<void>).catch((e) => {
                                try {
                                    // eslint-disable-next-line no-console
                                    console.warn('[CacheInterceptor] cache set failed:', e?.message ?? e);
                                } catch (_) { }
                            });
                        } catch (e) {
                            try {
                                // eslint-disable-next-line no-console
                                console.warn('[CacheInterceptor] cache set failed:', e?.message ?? e);
                            } catch (_) { }
                        }
                    }),
                );
            }),
        );
    }

    private cacheKey(req: any) {
        // Simple key: path + sorted query
        const q = req.query || {};
        const keys = Object.keys(q).sort();
        const qstr = keys.map((k) => `${k}=${q[k]}`).join('&');
        return `${req.path}?${qstr}`;
    }
}

import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { CacheInterceptor } from './cache.interceptor';

const mockExecutionContext = (method = 'GET', path = '/tasks', query = {}) => ({
    switchToHttp: () => ({
        getRequest: () => ({
            method,
            path,
            query,
        }),
    }),
} as unknown as ExecutionContext);

const mockCallHandler = (result: any) => ({
    handle: () => of(result),
} as unknown as CallHandler);

describe('CacheInterceptor', () => {
    it('returns cached value when cacheClient has key', async () => {
        const mockCacheClient = {
            get: jest.fn().mockResolvedValue(JSON.stringify({ items: [1], meta: {} })),
        } as any;

        const interceptor = new CacheInterceptor(mockCacheClient);
        const ctx = mockExecutionContext('GET', '/tasks', {});
        const handler = mockCallHandler({ items: [2] });

        const result = await interceptor.intercept(ctx, handler).toPromise();
        expect(result).toEqual({ items: [1], meta: {} });
        expect(mockCacheClient.get).toHaveBeenCalled();
    });

    it('calls handler and sets cache on miss', async () => {
        const mockCacheClient = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
        } as any;

        const interceptor = new CacheInterceptor(mockCacheClient);
        const ctx = mockExecutionContext('GET', '/tasks', { page: '1' });
        const handler = mockCallHandler({ items: [2], meta: { total: 1 } });

        const result = await interceptor.intercept(ctx, handler).toPromise();
        expect(result).toEqual({ items: [2], meta: { total: 1 } });
        expect(mockCacheClient.get).toHaveBeenCalled();
        expect(mockCacheClient.set).toHaveBeenCalled();
    });

    it('bypasses cache for non-GET methods', async () => {
        const mockCacheClient = {
            get: jest.fn(),
            set: jest.fn(),
        } as any;

        const interceptor = new CacheInterceptor(mockCacheClient);
        const ctx = mockExecutionContext('POST', '/tasks', {});
        const handler = mockCallHandler({ id: 1 });

        const result = await interceptor.intercept(ctx, handler).toPromise();
        expect(result).toEqual({ id: 1 });
        expect(mockCacheClient.get).not.toHaveBeenCalled();
    });
});

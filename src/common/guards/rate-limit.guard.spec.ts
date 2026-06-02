import { RateLimitGuard } from './rate-limit.guard';
import { ExecutionContext } from '@nestjs/common';

describe('RateLimitGuard', () => {
    let guard: RateLimitGuard;

    beforeEach(() => {
        process.env.RATE_LIMIT_MAX = '2';
        process.env.RATE_LIMIT_TTL = '60';
        guard = new RateLimitGuard();
    });

    function mockContext(ip = '127.0.0.1', method = 'GET', path = '/tasks'): ExecutionContext {
        return {
            switchToHttp: () => ({
                getRequest: () => ({ ip, method, path }),
            }),
        } as unknown as ExecutionContext;
    }

    it('allows requests up to the limit and blocks after', () => {
        const ctx = mockContext();
        expect(guard.canActivate(ctx)).toBe(true);
        expect(guard.canActivate(ctx)).toBe(true);
        expect(guard.canActivate(ctx)).toBe(false);
    });

    it('separates keys by ip+method+path', () => {
        const ctx1 = mockContext('1.1.1.1', 'GET', '/tasks');
        const ctx2 = mockContext('2.2.2.2', 'GET', '/tasks');
        expect(guard.canActivate(ctx1)).toBe(true);
        expect(guard.canActivate(ctx2)).toBe(true);
        expect(guard.canActivate(ctx1)).toBe(true);
        expect(guard.canActivate(ctx2)).toBe(true);
    });
});

import { ResponseInterceptor } from './response.interceptor';
import { of } from 'rxjs';

const mockContext = (statusCode = 200) => ({
    switchToHttp: () => ({ getResponse: () => ({ statusCode }) }),
} as any);

const mockNext = (data: any) => ({ handle: () => of(data) } as any);

describe('ResponseInterceptor', () => {
    it('wraps non-paginated response', (done) => {
        const it = new ResponseInterceptor();
        const ctx = mockContext(200);
        const next = mockNext({ foo: 'bar' });
        it.intercept(ctx as any, next as any).subscribe((res) => {
            expect(res).toEqual({ status: 'success', data: { foo: 'bar' } });
            done();
        });
    });

    it('returns null for 204 status', (done) => {
        const it = new ResponseInterceptor();
        const ctx = mockContext(204);
        const next = mockNext({});
        it.intercept(ctx as any, next as any).subscribe((res) => {
            expect(res).toBeNull();
            done();
        });
    });

    it('wraps paginated response', (done) => {
        const it = new ResponseInterceptor();
        const ctx = mockContext(200);
        const next = mockNext({ items: [1], meta: { total: 1 } });
        it.intercept(ctx as any, next as any).subscribe((res) => {
            expect(res).toEqual({ status: 'success', data: [1], meta: { total: 1 } });
            done();
        });
    });
});

import { RequestLoggingMiddleware } from './request-logging.middleware';

describe('RequestLoggingMiddleware', () => {
    it('calls loggingService.info on response finish', () => {
        const mockLoggingService: any = { info: jest.fn() };
        const mw = new RequestLoggingMiddleware(mockLoggingService);

        const listeners: Record<string, Function[]> = {};
        const res: any = {
            on: (ev: string, fn: Function) => {
                listeners[ev] = listeners[ev] || [];
                listeners[ev].push(fn);
            },
            statusCode: 200,
        };

        const req: any = { method: 'GET', originalUrl: '/test', ip: '127.0.0.1' };
        const next = jest.fn();

        mw.use(req, res, next);
        // simulate finish
        listeners['finish'].forEach((fn) => fn());

        expect(mockLoggingService.info).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});

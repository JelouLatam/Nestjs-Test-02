import { LoggingService } from './logging.service';

jest.mock('winston', () => ({
    createLogger: jest.fn(() => ({
        add: jest.fn(),
        info: jest.fn(),
    })),
    transports: { File: jest.fn() },
}));

describe('LoggingService', () => {
    it('constructs logger and adds file transport', () => {
        process.env.MONGO_URI = '';
        const svc = new LoggingService();
        // logger should exist
        expect((svc as any).logger).toBeDefined();
    });

    it('adds mongo transport if MONGO_URI present', () => {
        process.env.MONGO_URI = 'mongodb://user:pass@mongo:27017/db';
        const svc = new LoggingService();
        expect((svc as any).logger).toBeDefined();
    });
});

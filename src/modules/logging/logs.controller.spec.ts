import { LogsController } from './logs.controller';

describe('LogsController', () => {
    let ctrl: LogsController;

    beforeEach(() => {
        ctrl = new LogsController();
    });

    it('throws BadRequest when no mongo config', async () => {
        delete process.env.MONGO_URI;
        delete process.env.MONGO_HOST;
        await expect(ctrl.tail('10' as any)).rejects.toThrow();
    });

    it('calls getClient and returns docs when MONGO_URI provided', async () => {
        process.env.MONGO_URI = 'mongodb://user:pass@mongo:27017/db';
        const fakeClient: any = {
            connect: jest.fn().mockResolvedValue(true),
            db: () => ({
                collection: () => ({ find: () => ({ sort: () => ({ limit: () => ({ toArray: async () => [{ a: 1 }] }) }) }) }),
            }),
        };

        // monkeypatch getClient to return fake client
        (ctrl as any).getClient = jest.fn().mockResolvedValue(fakeClient);
        const res = await ctrl.tail('1');
        expect(res).toEqual([{ a: 1 }]);
    });
});

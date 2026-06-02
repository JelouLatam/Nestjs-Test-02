import { CacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { TasksService } from './tasks.service';
import { of } from 'rxjs';

function makeMockRepo() {
    return {
        save: jest.fn().mockImplementation(async (t) => ({ id: 1, ...t })),
        update: jest.fn().mockResolvedValue(undefined),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        find: jest.fn().mockResolvedValue([]),
        findOneBy: jest.fn().mockResolvedValue(null),
        createQueryBuilder: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
        }),
        count: jest.fn().mockResolvedValue(0),
    };
}

describe('Tasks integration (cache + service)', () => {
    it('caches GET result, then create invalidates cache', async () => {
        const store = new Map<string, string>();
        const mockCacheClient: any = {
            get: async (k: string) => store.get(k) ?? null,
            set: async (k: string, v: any) => { store.set(k, typeof v === 'string' ? v : JSON.stringify(v)); },
            delByPrefix: async (prefix: string) => {
                for (const k of Array.from(store.keys())) {
                    if (k.startsWith(prefix)) store.delete(k);
                }
            },
        };

        const repo = makeMockRepo();
        const svc = new TasksService(repo as any, mockCacheClient);
        const interceptor = new CacheInterceptor(mockCacheClient);

        // First GET: cache miss, handler called, cache populated
        const ctxGet: any = { switchToHttp: () => ({ getRequest: () => ({ method: 'GET', path: '/tasks', query: {} }) }) };
        const handler = { handle: () => of({ items: [{ id: 42 }], meta: {} }) } as any;

        const first = await interceptor.intercept(ctxGet as any, handler as any).toPromise();
        expect(first).toEqual({ items: [{ id: 42 }], meta: {} });
        // ensure cache stored
        const key = '/tasks?';
        expect(store.has(key)).toBe(true);

        // Now create a new task -> should call delByPrefix and remove cached key
        await svc.create({ title: 'new' } as any);
        expect(store.has(key)).toBe(false);
    });
});

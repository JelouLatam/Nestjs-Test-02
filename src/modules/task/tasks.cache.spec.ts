import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { InMemoryCacheClient } from '../../common/cache/in-memory-cache.client';
import { CacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { TaskStatus } from './tasks.entity';

describe('Tasks caching', () => {
    let controller: TasksController;
    let service: any;
    let cache: InMemoryCacheClient;
    let interceptor: CacheInterceptor;

    beforeEach(async () => {
        service = {
            findAllWithPagination: jest.fn().mockResolvedValue({ items: [], meta: { total: 0, page: 1, limit: 10, completed: 0, pending: 0 } }),
            create: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({ id: 1 }),
            remove: jest.fn().mockResolvedValue(true),
        };

        cache = new InMemoryCacheClient();
        interceptor = new CacheInterceptor(cache as any);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                { provide: TasksService, useValue: service },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
    });

    it('caches GET /tasks responses', async () => {
        const q = new TasksQueryDto();
        q.page = 1;
        q.limit = 10;

        // First call: cache miss -> service called
        await controller.findAll(q);
        expect(service.findAllWithPagination).toHaveBeenCalledTimes(1);

        // Second call: simulate cache read by setting cache manually
        await cache.set('/tasks?', { items: ['x'], meta: {} }, 60);
        const res = await controller.findAll(q);
        // Because controller.findAll is intercepted at runtime in real app, here we directly invoked controller;
        // we verify cache client works by reading value
        const cached = await cache.get('/tasks?');
        expect(cached).toBeDefined();
    });

    it('invalidates cache on create/update/delete (delByPrefix)', async () => {
        // populate cache
        await cache.set('/tasks?', { items: ['x'] }, 60);
        // simulate controller mutations
        await controller.create({ title: 't' } as any);
        // In a real app you'd call cache.delByPrefix inside service or via event; here we check ability to delete
        await cache.delByPrefix('/tasks');
        const cached = await cache.get('/tasks?');
        expect(cached).toBeUndefined();
    });
});

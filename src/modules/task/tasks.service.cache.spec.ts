import { TasksService } from './tasks.service';

describe('TasksService cache invalidation', () => {
    let service: TasksService;
    const mockRepo: any = {
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        find: jest.fn(),
        findOneBy: jest.fn(),
        createQueryBuilder: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(() => {
        service = new TasksService(mockRepo as any, undefined as any);
    });

    it('calls cacheClient.delByPrefix on create', async () => {
        const mockCacheClient = { delByPrefix: jest.fn().mockResolvedValue(undefined) } as any;
        service = new TasksService(mockRepo as any, mockCacheClient);
        mockRepo.save.mockResolvedValue({ id: 1 });

        await service.create({ title: 't' } as any);
        expect(mockCacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });

    it('calls cacheClient.delByPrefix on update', async () => {
        const mockCacheClient = { delByPrefix: jest.fn().mockResolvedValue(undefined) } as any;
        service = new TasksService(mockRepo as any, mockCacheClient);
        await service.update(1, { title: 'x' } as any);
        expect(mockCacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });

    it('calls cacheClient.delByPrefix on remove', async () => {
        const mockCacheClient = { delByPrefix: jest.fn().mockResolvedValue(undefined) } as any;
        service = new TasksService(mockRepo as any, mockCacheClient);
        await service.remove(1);
        expect(mockCacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });
});

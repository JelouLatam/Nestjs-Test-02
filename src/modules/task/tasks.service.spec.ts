import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

const createMockRepository = () => ({
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    count: jest.fn(),
});

describe('TasksService', () => {
    let service: TasksService;
    let repo: any;

    beforeEach(async () => {
        const mockCacheClient = { delByPrefix: jest.fn().mockResolvedValue(undefined) };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getRepositoryToken(Task), useValue: createMockRepository() },
                { provide: 'CACHE_CLIENT', useValue: mockCacheClient },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        repo = module.get<any>(getRepositoryToken(Task));
        // attach for assertions
        (service as any).cacheClient = mockCacheClient;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll returns tasks', async () => {
        const tasks: Task[] = [{ id: 1, title: 'A', description: null, status: TaskStatus.PENDING }];
        repo.find.mockResolvedValue(tasks);
        await expect(service.findAll()).resolves.toEqual(tasks);
    });

    it('findOne returns task', async () => {
        const task = { id: 1, title: 'A', description: null, status: TaskStatus.PENDING } as Task;
        repo.findOneBy.mockResolvedValue(task);
        await expect(service.findOne(1)).resolves.toEqual(task);
    });

    it('create saves task', async () => {
        const dto: CreateTaskDto = { title: 'New', description: 'desc' };
        const saved = { id: 10, title: 'New', description: 'desc', status: TaskStatus.PENDING } as Task;
        repo.save.mockResolvedValue(saved);
        await expect(service.create(dto)).resolves.toEqual(saved);
        expect((service as any).cacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });

    it('update calls repo.update', async () => {
        const dto: UpdateTaskDto = { title: 'Updated' };
        const updated = { id: 1, title: 'Updated', description: null, status: TaskStatus.PENDING } as Task;
        repo.update.mockResolvedValue(undefined);
        repo.findOneBy.mockResolvedValue(updated);
        await expect(service.update(1, dto)).resolves.toEqual(updated);
        expect((service as any).cacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });

    it('remove calls repo.delete', async () => {
        repo.delete.mockResolvedValue({ affected: 1 });
        await expect(service.remove(1)).resolves.toBe(true);
        expect((service as any).cacheClient.delByPrefix).toHaveBeenCalledWith('/tasks');
    });

    it('findAllWithPagination returns items and meta counters', async () => {
        const items: Task[] = [
            { id: 1, title: 'A', description: null, status: TaskStatus.COMPLETED },
        ];

        const qbMock: any = {
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([items, 1]),
        };

        repo.createQueryBuilder.mockReturnValue(qbMock);
        repo.count.mockImplementation(({ where }) => {
            if (where && (where as any).status === TaskStatus.COMPLETED) return Promise.resolve(1);
            if (where && (where as any).status === TaskStatus.PENDING) return Promise.resolve(0);
            return Promise.resolve(0);
        });

        const res = await service.findAllWithPagination(undefined, 1, 10);
        expect(res.items).toEqual(items);
        expect(res.meta.total).toBe(1);
        expect(res.meta.completed).toBe(1);
        expect(res.meta.pending).toBe(0);
    });
});

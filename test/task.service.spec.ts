import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../src/modules/tasks/application/task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from '../src/modules/tasks/domain/index';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<Task>;
  let cacheManager: Cache;

  const mockTaskRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockCache = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepo,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'Test',
        description: 'Desc',
        status: TaskStatus.PENDING,
      };
      const mockTask = { ...createTaskDto } as Task;
      mockTaskRepo.create.mockReturnValue(mockTask);
      mockTaskRepo.save.mockResolvedValue(mockTask);
      const result = await service.create(createTaskDto);
      expect(mockTaskRepo.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockTaskRepo.save).toHaveBeenCalledWith(mockTask);
      expect(mockCache.del).toHaveBeenCalledWith('/tasks');
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should find all tasks', async () => {
      mockTaskRepo.find.mockResolvedValue([
        { id: 1, title: 'Test', status: TaskStatus.PENDING } as Task,
      ]);
      const result = await service.findAll();
      expect(result.length).toBeGreaterThan(0);
      expect(mockTaskRepo.find).toHaveBeenCalled();
    });
    it('should find all tasks by status', async () => {
      mockTaskRepo.find.mockResolvedValue([
        { id: 2, title: 'Test2', status: TaskStatus.COMPLETED } as Task,
      ]);
      const result = await service.findAll(TaskStatus.COMPLETED);
      expect(result[0].status).toBe(TaskStatus.COMPLETED);
      expect(mockTaskRepo.find).toHaveBeenCalledWith({
        where: { status: TaskStatus.COMPLETED },
      });
    });
  });

  describe('findOne', () => {
    it('should find one task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test',
        status: TaskStatus.PENDING,
      } as Task;
      mockTaskRepo.findOne.mockResolvedValue(mockTask);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(mockTaskRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepo.findOne.mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toThrow('Task not found');
      expect(mockTaskRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test',
        status: TaskStatus.PENDING,
      } as Task;
      const updateDto = { title: 'Updated', status: TaskStatus.COMPLETED };
      mockTaskRepo.findOne.mockResolvedValue(mockTask);
      mockTaskRepo.save.mockResolvedValue({ ...mockTask, ...updateDto });
      mockCache.del.mockResolvedValue(undefined);
      const result = await service.update(1, updateDto);
      expect(mockTaskRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTaskRepo.save).toHaveBeenCalledWith({
        ...mockTask,
        ...updateDto,
      });
      expect(mockCache.del).toHaveBeenCalledWith('/tasks');
      expect(mockCache.del).toHaveBeenCalledWith('/tasks/1');
      expect(result.title).toBe('Updated');
      expect(result.status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskRepo.delete.mockResolvedValue({ affected: 1 });
      mockCache.del.mockResolvedValue(undefined);
      await service.remove(1);
      expect(mockTaskRepo.delete).toHaveBeenCalledWith(1);
      expect(mockCache.del).toHaveBeenCalledWith('/tasks');
      expect(mockCache.del).toHaveBeenCalledWith('/tasks/1');
    });
    it('should throw NotFoundException when removing non-existent task', async () => {
      mockTaskRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(999)).rejects.toThrow('Task not found');
      expect(mockTaskRepo.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('countByStatus', () => {
    it('should count tasks by status', async () => {
      mockTaskRepo.count.mockResolvedValue(5);
      const result = await service.countByStatus(TaskStatus.PENDING);
      expect(result).toBe(5);
      expect(mockTaskRepo.count).toHaveBeenCalledWith({
        where: { status: TaskStatus.PENDING },
      });
    });
  });
});

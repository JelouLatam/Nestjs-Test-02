import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Task } from './entities/task.entity';
import { CreateTodoDto, UpdateTodoDto, TaskStatus, QueryTasksDto } from './dtos';
import { CacheService } from '../common/services/cache.service';
import { mockCacheService } from '../test/test.config';

describe('TodosService', () => {
  let service: TodosService;
  let taskRepository: Repository<Task>;
  let cacheService: CacheService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      // Arrange
      const createTodoDto: CreateTodoDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      };
      const userId = 1;
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      // Act
      const result = await service.create(createTodoDto, userId);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: createTodoDto.title,
        description: createTodoDto.description,
        status: createTodoDto.status,
        userId,
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
      expect(mockCacheService.invalidateUserCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTask);
    });

    it('should set default status to PENDING when not provided', async () => {
      // Arrange
      const createTodoDto: CreateTodoDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const userId = 1;
      const mockTask = { id: 1, ...createTodoDto, status: TaskStatus.PENDING, userId };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      // Act
      await service.create(createTodoDto, userId);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: createTodoDto.title,
        description: createTodoDto.description,
        status: TaskStatus.PENDING,
        userId,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks with summary', async () => {
      // Arrange
      const queryDto: QueryTasksDto = { page: 1, limit: 10 };
      const userId = 1;
      const mockTasks = [
        { id: 1, title: 'Task 1', status: TaskStatus.PENDING, userId },
        { id: 2, title: 'Task 2', status: TaskStatus.COMPLETED, userId },
      ];

      mockTaskRepository.count
        .mockResolvedValueOnce(2) // totalItems
        .mockResolvedValueOnce(1) // completedCount
        .mockResolvedValueOnce(1) // pendingCount
        .mockResolvedValueOnce(2); // totalCount

      mockTaskRepository.find.mockResolvedValue(mockTasks);

      // Act
      const result = await service.findAll(queryDto, userId);

      // Assert
      expect(result).toEqual({
        tasks: mockTasks,
        summary: {
          total: 2,
          completed: 1,
          pending: 1,
        },
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it('should filter tasks by status', async () => {
      // Arrange
      const queryDto: QueryTasksDto = { status: TaskStatus.COMPLETED };
      const userId = 1;

      mockTaskRepository.count.mockResolvedValue(1);
      mockTaskRepository.find.mockResolvedValue([]);

      // Act
      await service.findAll(queryDto, userId);

      // Assert
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId, status: TaskStatus.COMPLETED },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      // Arrange
      const taskId = 1;
      const userId = 1;
      const mockTask = { id: taskId, title: 'Test Task', userId };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      // Act
      const result = await service.findOne(taskId, userId);

      // Assert
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId, userId },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      // Arrange
      const taskId = 999;
      const userId = 1;

      mockTaskRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(taskId, userId)).rejects.toThrow(
        'Task with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      // Arrange
      const taskId = 1;
      const userId = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED,
      };
      const existingTask = { id: taskId, title: 'Old Task', userId };
      const updatedTask = { ...existingTask, ...updateTodoDto };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      // Act
      const result = await service.update(taskId, updateTodoDto, userId);

      // Assert
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(mockCacheService.invalidateUserCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      // Arrange
      const taskId = 999;
      const userId = 1;
      const updateTodoDto: UpdateTodoDto = { title: 'Updated Task' };

      mockTaskRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(taskId, updateTodoDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      // Arrange
      const taskId = 1;
      const userId = 1;
      const mockTask = { id: taskId, title: 'Task to delete', userId };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      // Act
      const result = await service.remove(taskId, userId);

      // Assert
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(mockTask);
      expect(mockCacheService.invalidateUserCache).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      // Arrange
      const taskId = 999;
      const userId = 1;

      mockTaskRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(taskId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

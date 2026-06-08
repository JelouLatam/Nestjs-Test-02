import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, TaskStatus, QueryTasksDto } from './dtos';
import { User } from '../auth/entities/user.entity';

describe('TodosController', () => {
  let controller: TodosController;
  let todosService: TodosService;

  const mockTodosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed-password',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    todosService = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      // Arrange
      const createTodoDto: CreateTodoDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      };
      const expectedTask = {
        id: 1,
        ...createTodoDto,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTodosService.create.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.create(createTodoDto, mockUser);

      // Assert
      expect(mockTodosService.create).toHaveBeenCalledWith(createTodoDto, mockUser.id);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks with pagination and summary', async () => {
      // Arrange
      const queryDto: QueryTasksDto = { page: 1, limit: 10 };
      const expectedResult = {
        tasks: [
          {
            id: 1,
            title: 'Task 1',
            status: TaskStatus.PENDING,
            userId: mockUser.id,
          },
        ],
        summary: {
          total: 1,
          completed: 0,
          pending: 1,
        },
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockTodosService.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll(queryDto, mockUser);

      // Assert
      expect(mockTodosService.findAll).toHaveBeenCalledWith(queryDto, mockUser.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a specific task', async () => {
      // Arrange
      const taskId = '1';
      const expectedTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTodosService.findOne.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.findOne(taskId, mockUser);

      // Assert
      expect(mockTodosService.findOne).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      // Arrange
      const taskId = '1';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED,
      };
      const expectedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Test Description',
        status: TaskStatus.COMPLETED,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTodosService.update.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.update(taskId, updateTodoDto, mockUser);

      // Assert
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateTodoDto, mockUser.id);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      // Arrange
      const taskId = '1';
      const expectedTask = {
        id: 1,
        title: 'Task to delete',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTodosService.remove.mockResolvedValue(expectedTask);

      // Act
      const result = await controller.remove(taskId, mockUser);

      // Assert
      expect(mockTodosService.remove).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(expectedTask);
    });
  });
});

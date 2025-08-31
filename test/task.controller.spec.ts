import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../src/modules/tasks/presentation/task.controller';
import { TaskService } from '../src/modules/tasks/application/task.service';
import { CreateTaskDto } from '../src/modules/tasks/presentation/dto/create-task.dto';
import { UpdateTaskDto } from '../src/modules/tasks/presentation/dto/update-task.dto';
import { UpdateStatusDto } from '../src/modules/tasks/presentation/dto/update-status.dto';
import { Task, TaskStatus } from '../src/modules/tasks/domain';
import { ResponseModel } from '../src/shared/models/response.model';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const fixedDate = new Date('2023-01-01T00:00:00Z');
  const mockTask: Task = {
    id: 1,
    title: 'Test',
    description: 'Desc',
    status: TaskStatus.PENDING,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
    countByStatus: jest.fn().mockResolvedValue(5),
  };

  const mockCache = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should create a task', async () => {
    const dto: CreateTaskDto = { title: 'Test', description: 'Desc' };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data).toEqual(mockTask);
    expect(result.statusCode).toBe(201);
  });

  it('should get all tasks', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toBeInstanceOf(ResponseModel);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.statusCode).toBe(200);
  });

  it('should get a single task', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data).toEqual(mockTask);
    expect(result.statusCode).toBe(200);
  });

  it('should update a task', async () => {
    const dto: UpdateTaskDto = { title: 'Updated' };
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data.title).toBe('Updated');
    expect(result.statusCode).toBe(200);
  });

  it('should update task status', async () => {
    const dto: UpdateStatusDto = { status: TaskStatus.COMPLETED };
    mockService.update.mockResolvedValue({
      ...mockTask,
      status: TaskStatus.COMPLETED,
    });
    const result = await controller.updateStatus(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data.status).toBe(TaskStatus.COMPLETED);
    expect(result.statusCode).toBe(200);
  });

  it('should get status count', async () => {
    mockService.countByStatus.mockResolvedValueOnce(3).mockResolvedValueOnce(2);
    const result = await controller.getStatusCount();
    expect(service.countByStatus).toHaveBeenCalledWith(TaskStatus.COMPLETED);
    expect(service.countByStatus).toHaveBeenCalledWith(TaskStatus.PENDING);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data).toHaveProperty('completed', 3);
    expect(result.data).toHaveProperty('pending', 2);
    expect(result.statusCode).toBe(200);
  });

  it('should delete a task', async () => {
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.data).toBeUndefined();
    expect(result.statusCode).toBe(200);
  });

  it('should handle not found error in findOne', async () => {
    mockService.findOne.mockRejectedValueOnce(
      new NotFoundException('Task not found'),
    );
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });
});

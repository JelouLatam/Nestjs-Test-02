/* eslint-disable @typescript-eslint/no-unused-vars */
// test/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task, TaskStatus } from '../entities/task.entity';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { User } from 'src/auth/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';

describe('TasksController', () => {
  let tasksController: TasksController;

  const MOCK_TASK_ID = '2f5f4e8f-1089-4892-ba3d-d07dedc4564b';
  const MOCK_USER_ID = '289c9b37-5d32-4411-825b-3fb042f6b749';
  const MOCK_USER_EMAIL = 'updavo@gmail.com';
  const MOCK_USER_PASSWORD_HASH =
    '$2b$10$IAs.mvPApivMuo9/mKvDLew2uW.UD.4Ult6Ock7s.mN5RnNwh.GQm';
  const MOCK_USER_PASSWORD_PLAIN = '12x3x4x5';

  const mockUser: User = {
    id: MOCK_USER_ID,
    email: MOCK_USER_EMAIL,
    password: MOCK_USER_PASSWORD_HASH,
    tasks: [],
    validatePassword: jest.fn((password: string) =>
      Promise.resolve(password === MOCK_USER_PASSWORD_PLAIN),
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User;

  const mockTask: Task = {
    id: MOCK_TASK_ID,
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    user: mockUser,
  };

  const mockTasksService = {
    create: () => Promise.resolve(mockTask),
    findAll: () => Promise.resolve([mockTask]),
    findOne: () => Promise.resolve(mockTask),
    update: () => Promise.resolve(mockTask),
    remove: () => Promise.resolve(undefined),
    restore: () => Promise.resolve(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: mockTasksService },
        {
          provide: 'CACHE_MANAGER',
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    // Asignar la instancia del controlador:
    tasksController = module.get<TasksController>(TasksController);
  });

  it('debería estar definido', () => {
    expect(tasksController).toBeDefined();
  });

  it('debería crear una tarea', async () => {
    const createTaskDto: CreateTaskDto = { title: 'Task 1', description: '' };
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(tasksController.create(createTaskDto, req)).resolves.toEqual(
      mockTask,
    );
  });

  it('debería obtener todas las tareas', async () => {
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(tasksController.findAll(req)).resolves.toEqual([mockTask]);
  });

  it('debería obtener una tarea por ID', async () => {
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(tasksController.findOne(MOCK_TASK_ID, req)).resolves.toEqual(
      mockTask,
    );
  });

  it('debería actualizar una tarea', async () => {
    const updateTaskDto: UpdateTaskDto = {
      id: MOCK_TASK_ID,
      title: 'Updated Task',
    };
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(
      tasksController.update(MOCK_TASK_ID, updateTaskDto, req),
    ).resolves.toEqual(mockTask);
  });

  it('debería eliminar una tarea', async () => {
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(
      tasksController.remove(MOCK_TASK_ID, req),
    ).resolves.toBeUndefined();
  });

  it('debería restaurar una tarea', async () => {
    const req = { user: mockUser } as AuthenticatedRequest;

    await expect(tasksController.restore(MOCK_TASK_ID, req)).resolves.toEqual(
      mockTask,
    );
  });
});

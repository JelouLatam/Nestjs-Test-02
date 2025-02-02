// test/tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { User } from '../../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: Repository<Task>;

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

  const mockTaskRepository = {
    create: () => mockTask,
    save: () => Promise.resolve(mockTask),
    find: () => Promise.resolve([mockTask]),
    findOne: () => Promise.resolve(mockTask),
    softRemove: () => Promise.resolve(undefined),
    restore: () => Promise.resolve(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('debería estar definido', () => {
    expect(tasksService).toBeDefined();
  });

  it('debería crear una tarea', async () => {
    const createTaskDto: CreateTaskDto = { title: 'Task 1', description: '' };
    await expect(tasksService.create(createTaskDto, mockUser)).resolves.toEqual(
      mockTask,
    );
  });

  it('debería obtener todas las tareas', async () => {
    await expect(tasksService.findAll(mockUser)).resolves.toEqual([mockTask]);
  });

  it('debería obtener una tarea por ID', async () => {
    await expect(tasksService.findOne(MOCK_TASK_ID, mockUser)).resolves.toEqual(
      mockTask,
    );
  });

  it('debería lanzar un error si la tarea no existe', async () => {
    jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce(null);
    await expect(
      tasksService.findOne('non-existent-uuid', mockUser),
    ).rejects.toThrow(NotFoundException);
  });

  it('debería actualizar una tarea', async () => {
    const updateTaskDto: UpdateTaskDto = {
      id: MOCK_TASK_ID,
      title: 'Updated Task',
    };
    await expect(
      tasksService.update(MOCK_TASK_ID, updateTaskDto, mockUser),
    ).resolves.toEqual(mockTask);
  });

  it('debería eliminar una tarea', async () => {
    await expect(
      tasksService.remove(MOCK_TASK_ID, mockUser),
    ).resolves.toBeUndefined();
  });

  it('debería restaurar una tarea', async () => {
    await expect(tasksService.restore(MOCK_TASK_ID, mockUser)).resolves.toEqual(
      mockTask,
    );
  });
});

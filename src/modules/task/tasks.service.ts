import { Injectable, Inject, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './tasks.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

export interface PaginatedTasks {
  items: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    completed: number;
    pending: number;
  };
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Optional()
    @Inject('CACHE_CLIENT')
    private cacheClient?: { delByPrefix(prefix: string): Promise<void> },
  ) { }

  testModule(): String {
    return "Hello from testModule!";
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findAllWithPagination(status?: TaskStatus, page = 1, limit = 10): Promise<PaginatedTasks> {
    const qb = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      qb.where('task.status = :status', { status });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const completed = await this.tasksRepository.count({ where: { status: TaskStatus.COMPLETED } });
    const pending = await this.tasksRepository.count({ where: { status: TaskStatus.PENDING } });

    return {
      items,
      meta: { total, page, limit, completed, pending },
    };
  }

  findOne(id: number): Promise<Task | null> {
    return this.tasksRepository.findOneBy({ id });
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    if (createTaskDto.description !== undefined) {
      task.description = createTaskDto.description;
    }
    const saved = await this.tasksRepository.save(task);
    if (this.cacheClient) await this.cacheClient.delByPrefix('/tasks');
    return saved;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    await this.tasksRepository.update(id, updateTaskDto);
    if (this.cacheClient) await this.cacheClient.delByPrefix('/tasks');
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.tasksRepository.delete(id);
    const ok = res.affected ? res.affected > 0 : false;
    if (ok && this.cacheClient) await this.cacheClient.delByPrefix('/tasks');
    return ok;
  }
}

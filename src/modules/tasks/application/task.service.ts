import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task, TaskStatus } from '../domain';
import { CreateTaskDto, UpdateTaskDto } from '../presentation/dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);
    await this.invalidateCache();
    return savedTask;
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    if (status) {
      return await this.taskRepository.find({ where: { status } });
    }
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);
    await this.invalidateCache(id);
    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Task not found');
    await this.invalidateCache(id);
  }
  
  private async invalidateCache(id?: number) {
    await this.cacheManager.del('/tasks');
    if (id !== undefined) {
      await this.cacheManager.del(`/tasks/${id}`);
    }
  }
  
  async countByStatus(status: TaskStatus): Promise<number> {
    return await this.taskRepository.count({ where: { status } });
  }
}

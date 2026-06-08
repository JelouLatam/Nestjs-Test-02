import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto, UpdateTodoDto, TaskStatus, QueryTasksDto } from './dtos';
import { Task } from './entities';
import { PaginatedResponse, PaginationMeta } from '../common/dto';
import { CacheService } from '../common/services';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private cacheService: CacheService,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTodoDto.title,
      description: createTodoDto.description,
      status: createTodoDto.status || TaskStatus.PENDING,
      userId,
    });
    
    const savedTask = await this.taskRepository.save(task);
    
    // Invalidate user's cache when creating a task
    await this.cacheService.invalidateUserCache(userId);
    
    return savedTask;
  }

  async findAll(queryDto: QueryTasksDto, userId: number) {
    const { page, limit, status } = queryDto;
    
    // Build where clause - always filter by user
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Get total count for pagination
    const totalItems = await this.taskRepository.count({ where });

    let tasks: Task[];
    let paginationMeta: PaginationMeta | undefined;

    // Check if pagination parameters were provided OR if there are more than 10 items
    const paginationRequested = page !== undefined || limit !== undefined;
    const needsPagination = paginationRequested || totalItems > 10;

    if (needsPagination) {
      // Set defaults for pagination
      const currentPage = page || 1;
      const itemsPerPage = limit || 10;
      const skip = (currentPage - 1) * itemsPerPage;

      // Use pagination
      tasks = await this.taskRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip,
        take: itemsPerPage,
      });

      const totalPages = Math.ceil(totalItems / itemsPerPage);
      paginationMeta = {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      };
    } else {
      // No pagination needed, return all items
      tasks = await this.taskRepository.find({
        where,
        order: { createdAt: 'DESC' },
      });
    }

    // Get summary counts for the specific user
    const completedCount = await this.taskRepository.count({
      where: { userId, status: TaskStatus.COMPLETED },
    });
    
    const pendingCount = await this.taskRepository.count({
      where: { userId, status: TaskStatus.PENDING },
    });

    const totalCount = await this.taskRepository.count({ where: { userId } });

    return {
      tasks,
      summary: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
      },
      ...(paginationMeta && { pagination: paginationMeta }),
    };
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ 
      where: { id, userId } 
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    const updatedTask = Object.assign(task, updateTodoDto);
    
    const savedTask = await this.taskRepository.save(updatedTask);
    
    // Invalidate user's cache when updating a task
    await this.cacheService.invalidateUserCache(userId);
    
    return savedTask;
  }

  async remove(id: number, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    const removedTask = await this.taskRepository.remove(task);
    
    // Invalidate user's cache when removing a task
    await this.cacheService.invalidateUserCache(userId);
    
    return removedTask;
  }
}

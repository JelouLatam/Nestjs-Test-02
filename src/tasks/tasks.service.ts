/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const newTask = this.taskRepository.create({ ...createTaskDto, user });
      return await this.taskRepository.save(newTask);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating task. Please try again.',
      );
    }
  }

  async findAll(
    user: User,
    paginationQuery?: PaginationQueryDto,
  ): Promise<Task[]> {
    try {
      const page = paginationQuery?.page || 1;
      const limit = paginationQuery?.limit || 10;
      const skip = (page - 1) * limit;

      return await this.taskRepository.find({
        where: { user, deletedAt: IsNull() },
        skip,
        take: limit,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving tasks.');
    }
  }

  async findOne(id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id, user, deletedAt: IsNull() },
      });

      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving task.');
    }
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    try {
      const task = await this.findOne(id, user);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }

      Object.assign(task, updateTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Error updating task.');
    }
  }

  async remove(id: string, user: User): Promise<void> {
    try {
      const task = await this.findOne(id, user);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }
      await this.taskRepository.softRemove(task);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting task.');
    }
  }

  async restore(id: string, user: User): Promise<Task> {
    try {
      // restore() devuelve un UpdateResult. Verificamos si se afectó alguna fila.
      const result = await this.taskRepository.restore(id);
      if (!result.affected) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }

      return this.findOne(id, user);
    } catch (error) {
      throw new InternalServerErrorException('Error restoring task.');
    }
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    try {
      const task = await this.findOne(id, user);
      task.status = status;
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new InternalServerErrorException('Error updating task status.');
    }
  }

  async getStats(user: User): Promise<{ completed: number; pending: number }> {
    try {
      const completed = await this.taskRepository.count({
        where: {
          user,
          status: TaskStatus.COMPLETED,
          deletedAt: IsNull(),
        },
      });

      const pending = await this.taskRepository.count({
        where: {
          user,
          status: TaskStatus.PENDING,
          deletedAt: IsNull(),
        },
      });

      return { completed, pending };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving tasks stats.');
    }
  }
}

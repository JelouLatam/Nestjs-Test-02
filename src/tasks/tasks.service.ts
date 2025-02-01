/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../auth/entities/user.entity';

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

  async findAll(user: User): Promise<Task[]> {
    try {
      return await this.taskRepository.find({
        where: { user, deletedAt: IsNull() },
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
      const task = await this.taskRepository.restore(id);
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found.`);
      }

      return this.findOne(id, user);
    } catch (error) {
      throw new InternalServerErrorException('Error restoring task.');
    }
  }
}

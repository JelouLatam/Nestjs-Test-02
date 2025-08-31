import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';

import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto } from './dto';
import { Task, TaskStatus } from '../domain';
import { TaskService } from '../application/task.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create(createTaskDto);
    return new ResponseModel<Task>(
      HttpStatus.CREATED,
      'Task created successfully',
      task,
    );
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(@Query('status') status?: TaskStatus) {
    const tasks = await this.taskService.findAll(status);
    return new ResponseModel<Task[]>(
      HttpStatus.OK,
      'Tasks retrieved successfully',
      tasks,
    );
  }

  @Get('status-count')
  @UseInterceptors(CacheInterceptor)
  async getStatusCount() {
    const completed = await this.taskService.countByStatus(
      TaskStatus.COMPLETED,
    );
    const pending = await this.taskService.countByStatus(TaskStatus.PENDING);
    return new ResponseModel(HttpStatus.OK, 'Task status count', {
      completed,
      pending,
    });
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    return new ResponseModel<Task>(
      HttpStatus.OK,
      'Task retrieved successfully',
      task,
    );
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);
    return new ResponseModel<Task>(
      HttpStatus.OK,
      'Task updated successfully',
      task,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.taskService.remove(id);
    return new ResponseModel<null>(HttpStatus.OK, 'Task deleted successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const task = await this.taskService.update(id, updateStatusDto);
    return new ResponseModel<Task>(
      HttpStatus.OK,
      'Task status updated successfully',
      task,
    );
  }
}

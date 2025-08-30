import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpStatus } from '@nestjs/common';
import { TaskService } from '../application/task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ResponseModel } from '../../../shared/response.model';
import { Task } from '../domain/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create(createTaskDto);
    return new ResponseModel<Task>(HttpStatus.CREATED, 'Task created successfully', task);
  }

  @Get()
  async findAll(@Query('status') status?: 'pending' | 'completed') {
    const tasks = await this.taskService.findAll(status);
    return new ResponseModel<Task[]>(HttpStatus.OK, 'Tasks retrieved successfully', tasks);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    return new ResponseModel<Task>(HttpStatus.OK, 'Task retrieved successfully', task);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);
    return new ResponseModel<Task>(HttpStatus.OK, 'Task updated successfully', task);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.taskService.remove(id);
    return new ResponseModel<null>(HttpStatus.OK, 'Task deleted successfully');
  }
}

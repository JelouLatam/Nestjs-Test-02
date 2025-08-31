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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto } from './dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Task, TaskStatus } from '../domain';
import { TaskService } from '../application/task.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Tasks')
@ApiBearerAuth()
@ApiExtraModels(
  Task,
  ResponseModel,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateStatusDto,
)
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      basic: {
        summary: 'Basic task',
        value: { title: 'My Task', description: 'Optional description' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: ResponseModel,
  })
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
  @ApiOperation({ summary: 'Get paginated list of tasks' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of tasks',
    type: ResponseModel,
  })
  async findAll(
    @Query('status') status?: TaskStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const { tasks, total } = await this.taskService.findAll(
      status,
      page,
      limit,
    );
    return new ResponseModel(HttpStatus.OK, 'Tasks retrieved successfully', {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  @Get('status-count')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get count of tasks by status' })
  @ApiResponse({
    status: 200,
    description: 'Task status count',
    type: ResponseModel,
  })
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
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: ResponseModel,
  })
  async findOne(@Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    return new ResponseModel<Task>(
      HttpStatus.OK,
      'Task retrieved successfully',
      task,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: ResponseModel,
  })
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);
    return new ResponseModel<Task>(
      HttpStatus.OK,
      'Task updated successfully',
      task,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    type: ResponseModel,
  })
  async remove(@Param('id') id: number) {
    await this.taskService.remove(id);
    return new ResponseModel<null>(HttpStatus.OK, 'Task deleted successfully');
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update the status of a task by ID',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    type: ResponseModel,
  })
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

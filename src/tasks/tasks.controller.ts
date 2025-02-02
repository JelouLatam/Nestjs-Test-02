/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UseGuards,
  Req,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { CacheKey, CacheInterceptor } from '@nestjs/cache-manager';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskStatus } from './entities/task.entity';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('api/tasks')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  @CacheKey('tasks-list')
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Task[]> {
    return this.tasksService.findAll(req.user, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.findOne(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.tasksService.remove(id, req.user);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted task' })
  @ApiResponse({ status: 200, description: 'Task restored successfully' })
  restore(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.restore(id, req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mark a task as completed or pending' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, status, req.user);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get stats of tasks (completed vs pending)' })
  @ApiResponse({
    status: 200,
    description: 'Returns completed and pending tasks count',
  })
  getStats(@Req() req: AuthenticatedRequest) {
    return this.tasksService.getStats(req.user);
  }
}

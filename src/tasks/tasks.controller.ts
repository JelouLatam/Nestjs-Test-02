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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('api/tasks')
@UseGuards(AuthGuard('jwt')) // Protege todos los endpoints con JWT
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new task for the authenticated user
   *
   * @endpoint POST /tasks
   *
   * @payload
   * {
   *   "title": "Task title",
   *   "description": "Optional task description",
   *   "status": "pending"
   * }
   *
   * @header
   * Authorization: Bearer <jwt_token>
   *
   * @returns {Task} The created task assigned to the authenticated user
   */
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, req.user);
  }

  /**
   * Get all tasks for the authenticated user
   *
   * @endpoint GET /tasks
   *
   * @header
   * Authorization: Bearer <jwt_token>
   *
   * @returns {Task[]} List of tasks belonging to the authenticated user
   */
  @Get()
  @CacheKey('tasks-list')
  @CacheTTL(30)
  findAll(@Req() req: AuthenticatedRequest): Promise<Task[]> {
    return this.tasksService.findAll(req.user);
  }

  /**
   * Get a specific task by ID for the authenticated user
   *
   * @endpoint GET /tasks/:id
   *
   * @param {string} id - The ID of the task
   *
   * @header
   * Authorization: Bearer <jwt_token>
   *
   * @returns {Task} The requested task (if it belongs to the authenticated user)
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.findOne(id, req.user);
  }

  /**
   * Update a task by ID for the authenticated user
   *
   * @endpoint PUT /tasks/:id
   *
   * @param {string} id - The ID of the task
   *
   * @payload
   * {
   *   "title": "Updated title",
   *   "description": "Updated description",
   *   "status": "completed"
   * }
   *
   * @header
   * Authorization: Bearer <jwt_token>
   *
   * @returns {Task} The updated task
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  /**
   * Soft delete a task (mark as deleted)
   *
   * @endpoint DELETE /tasks/:id
   *
   * @header Authorization: Bearer <jwt_token>
   *
   * @returns {void} Task is marked as deleted
   */
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.tasksService.remove(id, req.user);
  }

  /**
   * Restore a deleted task
   *
   * @endpoint PATCH /tasks/:id/restore
   *
   * @header Authorization: Bearer <jwt_token>
   *
   * @returns {Task} Restored task
   */
  @Patch(':id/restore')
  restore(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Task> {
    return this.tasksService.restore(id, req.user);
  }
}

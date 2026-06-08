import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, QueryTasksDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CacheInterceptor } from '../common/interceptors';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 task creations per minute
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ 
    status: 201, 
    description: 'Task has been successfully created.',
    schema: {
      example: {
        id: 1,
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the NestJS todo API',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 429, description: 'Too many requests. Limit: 20 task creations per minute' })
  create(@Body() createTodoDto: CreateTodoDto, @GetUser() user: User) {
    return this.todosService.create(createTodoDto, user.id);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all tasks with optional status filter and pagination (cached)' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'completed'], description: 'Filter tasks by status' })
  @ApiQuery({ name: 'page', required: false, type: 'number', description: 'Page number (starts from 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Items per page (max 100)', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tasks with summary. Includes pagination when more than 10 items.',
    schema: {
      example: {
        tasks: [
          {
            id: 1,
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation',
            status: 'pending',
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z'
          }
        ],
        summary: {
          total: 25,
          completed: 10,
          pending: 15
        },
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: false
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Query() queryDto: QueryTasksDto, @GetUser() user: User) {
    return this.todosService.findAll(queryDto, user.id);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get a specific task by ID (cached)' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Task found.',
    schema: {
      example: {
        id: 1,
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.todosService.findOne(+id, user.id);
  }

  @Put(':id')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 updates per minute
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Task has been successfully updated.',
    schema: {
      example: {
        id: 1,
        title: 'Updated task title',
        description: 'Updated description',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T12:45:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @GetUser() user: User) {
    return this.todosService.update(+id, updateTodoDto, user.id);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 15, ttl: 60000 } }) // 15 deletions per minute
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Task has been successfully deleted.',
    schema: {
      example: {
        id: 1,
        title: 'Deleted task',
        description: 'This task was deleted',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.todosService.remove(+id, user.id);
  }
}

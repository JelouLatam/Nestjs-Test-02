import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService, PaginatedTasks } from './tasks.service';
import { UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../../common/interceptors/cache.interceptor';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { TaskStatus } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async findAll(@Query() q: TasksQueryDto): Promise<PaginatedTasks> {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    return this.tasksService.findAllWithPagination(q.status as TaskStatus, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.tasksService.findOne(id);
    if (!item) {
      throw new NotFoundException('Task not found');
    }
    return item;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const updated = await this.tasksService.update(id, updateTaskDto);
    if (!updated) {
      throw new NotFoundException('Task not found');
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const ok = await this.tasksService.remove(id);
    if (!ok) {
      throw new NotFoundException('Task not found');
    }
    return { deleted: true, id };
  }
}

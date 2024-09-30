import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('counts')
  @ApiOperation({ summary: 'Obtener conteo de tareas completadas y pendientes' })
  async getCounts() {
    return this.taskService.getTaskCounts();
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'La tarea ha sido creada.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  async findAll(@Query('status') status: TaskStatus) {
    return this.taskService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  async findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  @ApiBody({
    description: 'Datos para actualizar una tarea',
    type: UpdateTaskDto,
  })
  @ApiResponse({ status: 200, description: 'La tarea ha sido actualizada.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea por ID' })
  async remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

}

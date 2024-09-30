import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Título de la tarea' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Descripción de la tarea', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Status de la tarea', required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}

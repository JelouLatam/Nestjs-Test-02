import { IsString, IsOptional, Length, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../domain/task-status.enum';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'My Updated Task',
    required: false,
    description: 'Updated title of the task',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiProperty({
    example: 'Updated description',
    required: false,
    description: 'Updated description of the task',
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiProperty({
    example: 'COMPLETED',
    required: false,
    enum: [TaskStatus.PENDING, TaskStatus.COMPLETED],
    description: 'Updated status of the task',
  })
  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status?: TaskStatus;
}

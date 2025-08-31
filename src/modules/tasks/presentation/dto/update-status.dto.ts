import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../domain/task-status.enum';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'COMPLETED',
    enum: [TaskStatus.PENDING, TaskStatus.COMPLETED],
    description: 'New status for the task',
  })
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status: TaskStatus;
}

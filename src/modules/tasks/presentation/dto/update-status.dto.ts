import { IsIn } from 'class-validator';
import { TaskStatus } from '../../domain/task-status.enum';

export class UpdateStatusDto {
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status: TaskStatus;
}

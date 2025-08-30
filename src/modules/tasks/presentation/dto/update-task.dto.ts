import { IsString, IsOptional, Length, IsIn } from 'class-validator';
import { TaskStatus } from '../../domain/task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status?: TaskStatus;
}

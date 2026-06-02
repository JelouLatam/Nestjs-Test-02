import { IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { TaskStatus } from '../tasks.entity';

export class TasksQueryDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
    @IsEnum(TaskStatus, {
        message: `status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    })
    status?: TaskStatus;
}

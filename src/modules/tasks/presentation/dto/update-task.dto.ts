import { IsString, IsOptional, Length, IsIn } from 'class-validator';

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
  @IsIn(['pending', 'completed'])
  status?: 'pending' | 'completed';
}

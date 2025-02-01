import { IsUUID, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

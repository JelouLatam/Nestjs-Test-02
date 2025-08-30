import { IsString, IsOptional, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

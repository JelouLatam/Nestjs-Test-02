import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'My Task', description: 'Title of the task' })
  @IsString()
  @Length(1, 100)
  title: string;

  @ApiProperty({
    example: 'This is a description',
    required: false,
    description: 'Optional description of the task',
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}

import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Task UUID',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'Updated Task Title',
    description: 'Updated title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Updated Task Description',
    description: 'Updated description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

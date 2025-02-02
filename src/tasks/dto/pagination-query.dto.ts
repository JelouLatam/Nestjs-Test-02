import { IsOptional, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value as string, 10))
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value as string, 10))
  limit?: number;
}

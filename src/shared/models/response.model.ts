import { ApiProperty } from '@nestjs/swagger';
import { ApiError } from './api-error.model';

export class ResponseModel<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ type: 'object', nullable: true, additionalProperties: true })
  data?: T;

  @ApiProperty({ type: 'array', items: { type: 'object' }, nullable: true })
  errors?: ApiError[];

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    errors?: ApiError[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { winstonLogger } from './winston.logger';
import { ResponseModel } from './response.model';
import { ApiError, mapValidationErrors } from './api-error.model';
import { HttpExceptionResponse } from './http-exception-response.model';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = 500;
    let message = 'Internal server error';
    let errors: ApiError[] = [];

    if (exception instanceof ThrottlerException) {
      status = exception.getStatus();
      message = exception.message;
      errors = [{ message: 'Too Many Requests' }];
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const httpErrorResponse = res as HttpExceptionResponse;
        const { error, message: msg } = httpErrorResponse;

        if (Array.isArray(msg)) {
          message = error || exception.message || 'Validation Error';
          errors = mapValidationErrors(msg);
        } else if (typeof msg === 'string' && msg) {
          message = error || msg || exception.message || 'Error';
          errors = [{ message: msg }];
        } else {
          message = error || exception.message || 'Error';
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [{ message }];
    }

    winstonLogger.error(
      `[${request.method}] ${request.url} - ${status} - ${message}`,
      {
        method: request.method,
        url: request.url,
        statusCode: status,
        message,
        stack: exception instanceof Error ? exception.stack : undefined,
        errors,
      },
    );

    const responseModel = new ResponseModel<null>(
      status,
      message,
      undefined,
      errors.length > 0 ? errors : undefined,
    );
    response.status(status).json(responseModel);
  }
}

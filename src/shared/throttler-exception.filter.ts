import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ResponseModel } from './response.model';
import { ApiError } from './api-error.model';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const message = exception.message || 'Too Many Requests';
    const errors: ApiError[] = [{ message }];

    response.status(status).json({
      statusCode: status,
      message,
      errors
    });
  }
}

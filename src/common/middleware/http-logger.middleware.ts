import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      const logMessage = `${method} ${url} ${statusCode} ${contentLength || 0}b - ${responseTime}ms - ${userAgent} ${ip}`;
      
      // Log to console and files
      if (statusCode >= 500) {
        this.logger.error(logMessage, { context: 'HTTP' });
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, { context: 'HTTP' });
      } else {
        this.logger.info(logMessage, { context: 'HTTP' });
      }

      // Also log specifically to access logs
      const accessLogger = this.logger.child({ service: 'ACCESS' });
      accessLogger.info(logMessage);
    });

    next();
  }
}
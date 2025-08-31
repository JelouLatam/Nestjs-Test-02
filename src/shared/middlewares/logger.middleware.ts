import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../utils/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `[${method}] ${originalUrl} - ${res.statusCode} (${duration}ms)`;
      winstonLogger.info(logMessage, {
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        duration,
      });
    });
    next();
  }
}

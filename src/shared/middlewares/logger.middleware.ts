import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../utils/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const start = Date.now();
    let responseBody: unknown = null;
    const oldSend = res.send.bind(res);
    res.send = function (...args: [body: unknown, ...rest: unknown[]]) {
      responseBody = args[0];
      return oldSend(...args);
    };
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `[${method}] ${originalUrl} - ${res.statusCode} (${duration}ms)`;
      winstonLogger.info(logMessage, {
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        duration,
        request: body,
        response: responseBody,
      });
    });
    next();
  }
}

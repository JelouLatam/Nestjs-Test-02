import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const mongoUri = this.configService.get<string>(
      'MONGO_URI',
      'mongodb://localhost:27017/logs',
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ),
      transports: [
        new transports.File({ filename: 'logs/http.log', level: 'info' }),

        ...(mongoUri
          ? [
              new transports.MongoDB({
                level: 'info',
                db: mongoUri,
                collection: 'logs',
              }),
            ]
          : []),
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, body } = req;

    res.on('finish', () => {
      this.logger.info({
        method,
        url,
        status: res.statusCode,
        headers,
        body,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }
}

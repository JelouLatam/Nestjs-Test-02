import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../modules/logging/logging.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    private logger = new Logger('RequestLogger');

    constructor(private loggingService: LoggingService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();
        res.on('finish', () => {
            const ms = Date.now() - start;
            const meta = {
                method: req.method,
                path: req.originalUrl || req.url,
                status: res.statusCode,
                durationMs: ms,
                ip: req.ip,
            };

            try {
                if (this.loggingService && typeof this.loggingService.info === 'function') {
                    this.loggingService.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, meta);
                } else {
                    this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
                }
            } catch (e) {
                this.logger.error('Logging middleware failed', e as any);
            }
        });

        next();
    }
}

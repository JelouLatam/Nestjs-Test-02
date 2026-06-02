import { Injectable, Optional } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggingService {
    private logger: winston.Logger;

    constructor() {
        const transports: winston.transport[] = [];

        transports.push(
            new winston.transports.File({ filename: 'logs/app.log', level: 'info' }),
        );

        // Attempt to add Mongo transport if configured
        const mongoUri = process.env.MONGO_URI;
        if (mongoUri) {
            try {
                // lazy-require to avoid optional dependency issues
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { MongoDB } = require('winston-mongodb');
                const mongoLevel = process.env.MONGO_LOG_LEVEL ?? 'error';
                transports.push(new MongoDB({ db: mongoUri, level: mongoLevel, options: { useUnifiedTopology: true }, collection: 'app_logs' }));
            } catch (e) {
                // ignore if not available
                // eslint-disable-next-line no-console
                console.warn('winston-mongodb not installed or failed to load', e?.message ?? e);
            }
        }

        this.logger = winston.createLogger({ transports, exitOnError: false });
    }

    info(message: string, meta?: Record<string, any>) {
        this.logger.info(message, meta);
    }

    error(message: string, meta?: Record<string, any>) {
        this.logger.error(message, meta);
    }

    warn(message: string, meta?: Record<string, any>) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: Record<string, any>) {
        this.logger.debug(message, meta);
    }
}

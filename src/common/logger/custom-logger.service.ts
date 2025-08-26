import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CustomLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, stack?: string, context?: string) {
    this.logger.error(message, { context, stack });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom method for HTTP access logs
  logHttpRequest(message: string) {
    // Use a specific logger instance for HTTP logs
    const httpLogger = this.logger.child({ service: 'HTTP' });
    httpLogger.info(message);
  }

  // Custom method for database operations
  logDatabaseOperation(message: string, context: string = 'Database') {
    this.logger.info(message, { context });
  }

  // Custom method for business logic
  logBusinessEvent(message: string, context: string = 'Business') {
    this.logger.info(message, { context });
  }
}
import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const winstonLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/app.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      db: process.env.MONGO_URI || 'mongodb://localhost:27017/nest_logs',
      collection: 'logs',
      tryReconnect: true,
      options: { useUnifiedTopology: true },
      level: 'error',
    }),
  ],
});

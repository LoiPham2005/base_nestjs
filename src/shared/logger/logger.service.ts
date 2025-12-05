// ============================================
// src/shared/logger/logger.service.ts
// ============================================
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private context?: string;

  constructor(private configService: ConfigService) {
    this.logger = this.createLogger();
  }

  setContext(context: string) {
    this.context = context;
  }

  private createLogger(): winston.Logger {
    const logLevel = this.configService.get('LOG_LEVEL', 'info');
    const env = this.configService.get('NODE_ENV', 'development');

    const formats = [
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    ];

    // Add colorize for development
    if (env === 'development') {
      formats.push(winston.format.colorize({ all: true }));
    }

    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            const ctx = context ? `[${context}]` : '';
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} ${level} ${ctx} ${message} ${metaStr}`;
          }),
        ),
      }),

      // Error log file - Daily rotate
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: winston.format.combine(...formats),
      }),

      // Combined log file - Daily rotate
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: winston.format.combine(...formats),
      }),
    ];

    return winston.createLogger({
      level: logLevel,
      format: winston.format.combine(...formats),
      transports,
      exitOnError: false,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, {
      trace,
      context: context || this.context,
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context: context || this.context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context: context || this.context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context: context || this.context });
  }

  // Custom methods
  logWithMetadata(level: string, message: string, metadata: any) {
    this.logger.log(level, message, { ...metadata, context: this.context });
  }

  logHttpRequest(req: any, res: any, responseTime: number) {
    this.logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      context: this.context,
    });
  }

  logDatabaseQuery(query: string, duration: number) {
    this.logger.debug('Database Query', {
      query,
      duration: `${duration}ms`,
      context: this.context,
    });
  }

  logCacheOperation(operation: string, key: string, hit: boolean) {
    this.logger.debug('Cache Operation', {
      operation,
      key,
      hit,
      context: this.context,
    });
  }
}
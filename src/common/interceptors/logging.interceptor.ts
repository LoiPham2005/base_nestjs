// ============================================
// src/common/interceptors/logging.interceptor.ts
// ============================================
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userId = request.user?.id;
    const correlationId = request.headers['x-correlation-id'];
    const now = Date.now();

    this.logger.log(
      JSON.stringify({
        type: 'request',
        method,
        url,
        userId,
        correlationId,
        body: this.sanitizeBody(body),
        query,
        params,
      }),
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const responseTime = Date.now() - now;

          this.logger.log(
            JSON.stringify({
              type: 'response',
              method,
              url,
              userId,
              correlationId,
              statusCode: response.statusCode,
              responseTime: `${responseTime}ms`,
            }),
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;

          this.logger.error(
            JSON.stringify({
              type: 'error',
              method,
              url,
              userId,
              correlationId,
              error: error.message,
              stack: error.stack,
              responseTime: `${responseTime}ms`,
            }),
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
// ============================================
// src/common/exceptions/http-exception.filter.ts
// ============================================
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_CODES } from '../constants/error-codes.constant';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let details: any = null;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const response = exceptionResponse as any;
        message = response.message || response.error || message;
        errorCode = response.error?.code || errorCode;
        details = response.error?.details || response.details || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    // Log error
    this.logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify({
        statusCode: status,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params,
        user: (request as any).user?.id,
        stack,
      }),
    );

    // Send response
    response.status(status).json({
      success: false,
      message,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && stack && { stack }),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
    });
  }
}

// ============================================
// src/common/middlewares/logger.middleware.ts
// ============================================
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const correlationId = req.headers['x-correlation-id'];

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${userAgent} ${ip} [${correlationId}]`,
      );
    });

    next();
  }
}
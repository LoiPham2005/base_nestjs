// ============================================
// src/common/middlewares/correlation-id.middleware.ts
// ============================================
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONSTANTS } from '../constants/app.constant';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.headers[APP_CONSTANTS.CORRELATION_ID_HEADER] as string) ||
      (req.headers[APP_CONSTANTS.REQUEST_ID_HEADER] as string) ||
      uuidv4();

    req.headers[APP_CONSTANTS.CORRELATION_ID_HEADER] = correlationId;
    res.setHeader(APP_CONSTANTS.CORRELATION_ID_HEADER, correlationId);

    next();
  }
}
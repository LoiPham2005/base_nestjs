// ============================================
// src/common/exceptions/business.exception.ts
// ============================================
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.constant';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    errorCode: string = ERROR_CODES.BUSINESS_RULE_VIOLATION,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any,
  ) {
    super(
      {
        success: false,
        message,
        error: {
          code: errorCode,
          message,
          details,
        },
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
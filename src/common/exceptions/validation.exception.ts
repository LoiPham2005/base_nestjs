// ============================================
// src/common/exceptions/validation.exception.ts
// ============================================
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.constant';

export class ValidationException extends HttpException {
  constructor(errors: any) {
    super(
      {
        success: false,
        message: 'Validation failed',
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: errors,
        },
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
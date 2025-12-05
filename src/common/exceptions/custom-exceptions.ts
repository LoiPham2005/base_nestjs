// ============================================
// src/common/exceptions/custom-exceptions.ts
// ============================================
import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';
import { ERROR_CODES } from '../constants/error-codes.constant';
import { MESSAGES } from '../constants/messages.constant';

export class NotFoundException extends BusinessException {
  constructor(message: string = MESSAGES.NOT_FOUND) {
    super(message, ERROR_CODES.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends BusinessException {
  constructor(message: string = MESSAGES.UNAUTHORIZED) {
    super(message, ERROR_CODES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BusinessException {
  constructor(message: string = MESSAGES.FORBIDDEN) {
    super(message, ERROR_CODES.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}

export class ConflictException extends BusinessException {
  constructor(message: string = MESSAGES.ALREADY_EXISTS) {
    super(message, ERROR_CODES.CONFLICT, HttpStatus.CONFLICT);
  }
}

export class BadRequestException extends BusinessException {
  constructor(message: string, details?: any) {
    super(message, ERROR_CODES.INVALID_INPUT, HttpStatus.BAD_REQUEST, details);
  }
}

export class InternalServerException extends BusinessException {
  constructor(message: string = MESSAGES.INTERNAL_ERROR) {
    super(
      message,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
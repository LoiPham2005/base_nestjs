// ============================================
// src/common/dto/response.dto.ts
// ============================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;
}

export class ResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  statusCode: number;

  constructor(
    data: T,
    message?: string,
    statusCode: number = 200,
    path?: string,
  ) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path || '';
  }
}

export class PaginatedResponseDto<T> extends ResponseDto<T[]> {
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  constructor(
    data: T[],
    meta: MetaDto,
    message?: string,
    statusCode: number = 200,
  ) {
    super(data, message, statusCode);
    this.meta = meta;
  }
}

export class ErrorResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  error: {
    code: string;
    message: string;
    details?: any;
  };

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  statusCode: number;
}
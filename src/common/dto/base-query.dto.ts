// ============================================
// src/common/dto/base-query.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class BaseQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search query string',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to order by',
  })
  @IsString()
  @IsOptional()
  orderBy?: string;
}
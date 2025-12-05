// ============================================
// src/common/dto/pagination.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderDirection } from '../enums/order-by.enum';

export class PaginationDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: OrderDirection,
    default: OrderDirection.DESC,
    description: 'Sort order direction',
  })
  @IsEnum(OrderDirection)
  @IsOptional()
  orderDirection?: OrderDirection = OrderDirection.DESC;
}
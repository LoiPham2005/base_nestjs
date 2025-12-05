// ============================================
// src/common/dto/date-range.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
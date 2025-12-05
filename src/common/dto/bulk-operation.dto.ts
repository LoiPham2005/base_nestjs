// ============================================
// src/common/dto/bulk-operation.dto.ts
// ============================================
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of IDs to delete',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
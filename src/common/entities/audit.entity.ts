// ============================================
// src/common/entities/audit.entity.ts
// ============================================
import { Column } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SoftDeleteEntity } from './soft-delete.entity';

export abstract class AuditEntity extends SoftDeleteEntity {
  @ApiPropertyOptional({
    description: 'User ID who created this record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'User ID who last updated this record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'User ID who deleted this record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ type: 'uuid', nullable: true })
  deletedBy?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}
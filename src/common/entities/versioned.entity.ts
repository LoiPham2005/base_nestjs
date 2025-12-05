// ============================================
// src/common/entities/versioned.entity.ts
// ============================================
import { Column, VersionColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export abstract class VersionedEntity extends BaseEntity {
  @ApiProperty({
    description: 'Entity version for optimistic locking',
    example: 1,
  })
  @VersionColumn()
  version: number;

  @ApiProperty({
    description: 'Indicates if this is the active version',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
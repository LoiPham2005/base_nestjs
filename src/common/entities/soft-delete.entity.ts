// ============================================
// src/common/entities/soft-delete.entity.ts
// ============================================
import { DeleteDateColumn } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';

export abstract class SoftDeleteEntity extends BaseEntity {
  @ApiPropertyOptional({
    description: 'Soft delete timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  // Soft delete method
  async softDelete(): Promise<this> {
    this.deletedAt = new Date();
    return this.save();
  }

  // Restore soft deleted entity
  async restore(): Promise<this> {
    this.deletedAt = undefined;
    return this.save();
  }

  // Check if entity is soft deleted
  get isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
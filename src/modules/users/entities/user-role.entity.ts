// ============================================
// src/modules/users/entities/user-role.entity.ts
// ============================================
import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

export interface ExtraPermissions {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
  conditions?: Record<string, any>;
}

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRole extends BaseEntity {
  @ApiProperty({
    description: 'User ID',
  })
  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @ApiProperty({
    description: 'Role ID',
  })
  @Column({ name: 'role_id', type: 'uuid' })
  @Index()
  roleId: string;

  @ApiProperty({
    description: 'Is primary role',
    example: true,
  })
  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @ApiPropertyOptional({
    description: 'Extra permissions beyond role permissions',
  })
  @Column({ name: 'extra_permissions', type: 'jsonb', nullable: true })
  extraPermissions?: ExtraPermissions[];

  @ApiProperty({
    description: 'Date when role was assigned',
  })
  @Column({ name: 'assigned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @ApiPropertyOptional({
    description: 'User ID who assigned the role',
  })
  @Column({ name: 'assigned_by', type: 'uuid', nullable: true })
  assignedBy?: string;

  @ApiPropertyOptional({
    description: 'Date when role assignment expires',
  })
  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Virtual properties
  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired;
  }

  get daysUntilExpiry(): number | null {
    if (!this.expiresAt) return null;
    const now = new Date();
    const days = Math.ceil((this.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }
}
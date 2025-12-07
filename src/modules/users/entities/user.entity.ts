// ============================================
// src/modules/users/entities/user.entity.ts
// ============================================
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SoftDeleteEntity } from '../../../common/entities/soft-delete.entity';
import { UserStatus, Gender } from '../../../common/enums/status.enum';
import { UserRole } from './user-role.entity';
import { UserSession } from '../../sessions/entities/user-session.entity';
import { SecurityLog } from '../../security/entities/security-log.entity';

export interface UserPreferences {
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  theme?: 'light' | 'dark' | 'system';
}

@Entity('users')
export class User extends SoftDeleteEntity {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true, length: 255 })
  @Index()
  email: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+84901234567',
  })
  @Column({ unique: true, length: 20 })
  @Index()
  phone: string;

  @ApiProperty({
    description: 'User password (hashed)',
  })
  @Column({ name: 'password_hash', length: 255 })
  @Exclude()
  passwordHash: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
  })
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User gender',
    enum: Gender,
  })
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
  })
  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Phone verification status',
    example: false,
  })
  @Column({ name: 'phone_verified', type: 'boolean', default: false })
  phoneVerified: boolean;

  @ApiProperty({
    description: 'Two-factor authentication enabled',
    example: false,
  })
  @Column({ name: 'two_factor_enabled', type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @ApiPropertyOptional({
    description: 'Two-factor secret',
  })
  @Column({ name: 'two_factor_secret', nullable: true, length: 255 })
  @Exclude()
  twoFactorSecret?: string;

  @ApiPropertyOptional({
    description: 'User preferences',
  })
  @Column({ type: 'jsonb', nullable: true })
  preferences?: UserPreferences;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
  })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  // Relations
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToMany(() => SecurityLog, (log) => log.user)
  securityLogs: SecurityLog[];

  // Virtual properties
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get isVerified(): boolean {
    return this.emailVerified || this.phoneVerified;
  }
}
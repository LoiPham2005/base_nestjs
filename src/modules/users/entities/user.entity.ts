// ============================================
// Example User Entity using Base Entity
// src/modules/users/entities/user.entity.ts
// ============================================
import { Entity, Column, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SoftDeleteEntity } from '../../../common/entities/soft-delete.entity';
import { Role } from '../../../common/enums/role.enum';
import { UserStatus } from '../../../common/enums/status.enum';

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
    description: 'User password (hashed)',
  })
  @Column({ length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Column({ length: 100 })
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @Column({ nullable: true, length: 20 })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @Column({ nullable: true, length: 500 })
  avatar?: string;

  @ApiProperty({
    description: 'User roles',
    enum: Role,
    isArray: true,
    example: [Role.USER],
  })
  @Column({
    type: 'simple-array',
    default: Role.USER,
  })
  roles: Role[];

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @ApiProperty({
    description: 'Email verification status',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
  })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @ApiPropertyOptional({
    description: 'Email verification token',
  })
  @Column({ nullable: true, length: 500 })
  @Exclude()
  emailVerificationToken?: string;

  @ApiPropertyOptional({
    description: 'Password reset token',
  })
  @Column({ nullable: true, length: 500 })
  @Exclude()
  passwordResetToken?: string;

  @ApiPropertyOptional({
    description: 'Password reset token expiry',
  })
  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires?: Date;

  // Virtual property for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
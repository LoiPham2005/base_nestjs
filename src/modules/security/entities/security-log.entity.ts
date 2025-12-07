// // ============================================
// // src/modules/security/entities/security-log.entity.ts
// // ============================================
// import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { BaseEntity } from '../../../common/entities/base.entity';
// import { User } from '../../users/entities/user.entity';

// export enum SecurityLogType {
//   LOGIN = 'login',
//   LOGOUT = 'logout',
//   PASSWORD_RESET = 'password_reset',
//   PASSWORD_CHANGED = 'password_changed',
//   OTP_SENT = 'otp_sent',
//   OTP_VERIFIED = 'otp_verified',
//   EMAIL_VERIFIED = 'email_verified',
//   PHONE_VERIFIED = 'phone_verified',
//   TWO_FA_ENABLED = 'two_fa_enabled',
//   TWO_FA_DISABLED = 'two_fa_disabled',
//   ROLE_ASSIGNED = 'role_assigned',
//   ROLE_REVOKED = 'role_revoked',
//   PERMISSION_GRANTED = 'permission_granted',
//   PERMISSION_REVOKED = 'permission_revoked',
//   SUSPICIOUS_ACTIVITY = 'suspicious_activity',
//   FAILED_LOGIN_ATTEMPT = 'failed_login_attempt',
//   ACCOUNT_LOCKED = 'account_locked',
//   ACCOUNT_UNLOCKED = 'account_unlocked',
//   IP_CHANGED = 'ip_changed',
//   UNUSUAL_LOGIN_LOCATION = 'unusual_login_location',
// }

// export enum SecurityLogStatus {
//   SUCCESS = 'success',
//   FAILED = 'failed',
//   BLOCKED = 'blocked',
//   SUSPICIOUS = 'suspicious',
// }

// @Entity('security_logs')
// @Index(['userId', 'createdAt'])
// @Index(['logType', 'createdAt'])
// @Index(['status', 'createdAt'])
// @Index(['ipAddress', 'createdAt'])
// export class SecurityLog extends BaseEntity {
//   @ApiPropertyOptional({
//     description: 'User ID',
//   })
//   @Column({ name: 'user_id', type: 'uuid', nullable: true })
//   @Index()
//   userId?: string;

//   @ApiProperty({
//     description: 'Log type',
//     enum: SecurityLogType,
//   })
//   @Column({
//     name: 'log_type',
//     type: 'enum',
//     enum: SecurityLogType,
//   })
//   logType: SecurityLogType;

//   @ApiProperty({
//     description: 'Log status',
//     enum: SecurityLogStatus,
//   })
//   @Column({
//     type: 'enum',
//     enum: SecurityLogStatus,
//     default: SecurityLogStatus.SUCCESS,
//   })
//   status: SecurityLogStatus;

//   @ApiPropertyOptional({
//     description: 'Authentication method (password, google, otp, etc.)',
//   })
//   @Column({ name: 'method', type: 'varchar', nullable: true, length: 50 })
//   method?: string;

//   @ApiProperty({
//     description: 'Metadata with additional details',
//   })
//   @Column({ name: 'metadata', type: 'jsonb', default: {} })
//   metadata: Record<string, any>;

//   @ApiPropertyOptional({
//     description: 'IP address',
//   })
//   @Column({ name: 'ip_address', type: 'varchar', nullable: true, length: 45 })
//   @Index()
//   ipAddress?: string;

//   @ApiPropertyOptional({
//     description: 'User agent',
//   })
//   @Column({ name: 'user_agent', type: 'text', nullable: true })
//   userAgent?: string;

//   @ApiPropertyOptional({
//     description: 'Country/Location',
//   })
//   @Column({ name: 'location', type: 'varchar', nullable: true, length: 100 })
//   location?: string;

//   @ApiPropertyOptional({
//     description: 'Device fingerprint',
//   })
//   @Column({ name: 'device_fingerprint', type: 'varchar', nullable: true, length: 255 })
//   deviceFingerprint?: string;

//   @ApiPropertyOptional({
//     description: 'Error message if failed',
//   })
//   @Column({ name: 'error_message', type: 'text', nullable: true })
//   errorMessage?: string;

//   // Relations
//   @ManyToOne(() => User, (user) => user.securityLogs, { onDelete: 'SET NULL' })
//   @JoinColumn({ name: 'user_id' })
//   user?: User;
// }
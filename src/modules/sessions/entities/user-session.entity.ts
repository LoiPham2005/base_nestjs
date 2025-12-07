// // ============================================
// // src/modules/sessions/entities/user-session.entity.ts
// // ============================================
// import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { BaseEntity } from '../../../common/entities/base.entity';
// import { User } from '../../users/entities/user.entity';

// export interface DeviceInfo {
//   userAgent: string;
//   ipAddress: string;
//   platform?: string;
//   browser?: string;
//   browserVersion?: string;
//   osVersion?: string;
//   deviceType?: 'mobile' | 'tablet' | 'desktop';
//   deviceName?: string;
// }

// @Entity('user_sessions')
// @Index(['userId', 'isActive'])
// @Index(['refreshTokenHash'], { unique: true })
// @Index(['expiresAt'])
// export class UserSession extends BaseEntity {
//   @ApiProperty({
//     description: 'Session ID (UUID)',
//     example: '550e8400-e29b-41d4-a716-446655440000',
//   })
//   @Column({ name: 'session_id', type: 'varchar', primary: true, length: 255 })
//   sessionId: string;

//   @ApiProperty({
//     description: 'User ID',
//   })
//   @Column({ name: 'user_id', type: 'uuid' })
//   @Index()
//   userId: string;

//   @ApiProperty({
//     description: 'Refresh token hash',
//   })
//   @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255, unique: true })
//   refreshTokenHash: string;

//   @ApiProperty({
//     description: 'Device information',
//   })
//   @Column({ name: 'device_info', type: 'jsonb' })
//   deviceInfo: DeviceInfo;

//   @ApiPropertyOptional({
//     description: 'FCM token for push notifications',
//   })
//   @Column({ name: 'fcm_token', type: 'varchar', nullable: true, length: 500 })
//   fcmToken?: string;

//   @ApiProperty({
//     description: 'Is active session',
//     example: true,
//   })
//   @Column({ name: 'is_active', type: 'boolean', default: true })
//   isActive: boolean;

//   @ApiPropertyOptional({
//     description: 'Last activity timestamp',
//   })
//   @Column({ name: 'last_activity_at', type: 'timestamp', nullable: true })
//   lastActivityAt?: Date;

//   @ApiProperty({
//     description: 'Session expiry date',
//   })
//   @Column({ name: 'expires_at', type: 'timestamp' })
//   expiresAt: Date;

//   @ApiPropertyOptional({
//     description: 'Session revoked date',
//   })
//   @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
//   revokedAt?: Date;

//   // Relations
//   @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   // Virtual properties
//   get isExpired(): boolean {
//     return new Date() > this.expiresAt;
//   }

//   get isRevoked(): boolean {
//     return !!this.revokedAt;
//   }

//   get isValid(): boolean {
//     return this.isActive && !this.isExpired && !this.isRevoked;
//   }

//   get timeoutMinutes(): number {
//     const now = new Date();
//     const minutes = Math.floor((this.expiresAt.getTime() - now.getTime()) / (1000 * 60));
//     return Math.max(0, minutes);
//   }
// }
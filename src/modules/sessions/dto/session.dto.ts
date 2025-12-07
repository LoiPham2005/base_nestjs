// // ============================================
// // src/modules/sessions/dto/session.dto.ts
// // ============================================
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsString, IsOptional, IsObject } from 'class-validator';
// import { DeviceInfo } from '../entities/user-session.entity';

// export class CreateSessionDto {
//   @ApiProperty()
//   @IsString()
//   userId: string;

//   @ApiProperty()
//   @IsString()
//   refreshToken: string;

//   @ApiProperty()
//   @IsObject()
//   deviceInfo: DeviceInfo;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   fcmToken?: string;
// }

// export class UpdateSessionDto {
//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsString()
//   fcmToken?: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsObject()
//   deviceInfo?: Partial<DeviceInfo>;
// }

// export class SessionResponseDto {
//   @ApiProperty()
//   sessionId: string;

//   @ApiProperty()
//   deviceInfo: DeviceInfo;

//   @ApiProperty()
//   isActive: boolean;

//   @ApiPropertyOptional()
//   lastActivityAt?: Date;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   expiresAt: Date;
// }
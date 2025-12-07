// ============================================
// src/modules/users/dto/assign-role.dto.ts
// ============================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDate,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AssignRoleDto {
  @ApiProperty({ example: 'uuid-of-role' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  extraPermissions?: Record<string, any>[];

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}

export class BulkAssignRoleDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiProperty({ example: 'uuid-of-role' })
  @IsUUID()
  roleId: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}
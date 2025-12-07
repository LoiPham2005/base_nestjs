// // ============================================
// // src/modules/roles/dto/create-role.dto.ts
// // ============================================
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import {
//   IsString,
//   IsOptional,
//   IsBoolean,
//   IsArray,
//   IsInt,
//   MinLength,
//   MaxLength,
//   Min,
//   Max,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { Permission } from '../entities/role.entity';

// export class PermissionDto {
//   @ApiProperty({ example: 'users' })
//   @IsString()
//   resource: string;

//   @ApiProperty({ example: ['read', 'create'] })
//   @IsArray()
//   @IsString({ each: true })
//   actions: string[];

//   @ApiPropertyOptional()
//   @IsOptional()
//   conditions?: Record<string, any>;
// }

// export class CreateRoleDto {
//   @ApiProperty({ example: 'Administrator' })
//   @IsString()
//   @MinLength(2)
//   @MaxLength(50)
//   roleName: string;

//   @ApiProperty({ example: 'admin' })
//   @IsString()
//   @MinLength(2)
//   @MaxLength(50)
//   roleCode: string;

//   @ApiPropertyOptional({ example: 'Full system access' })
//   @IsOptional()
//   @IsString()
//   description?: string;

//   @ApiProperty({ type: [PermissionDto] })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => PermissionDto)
//   permissions: PermissionDto[];

//   @ApiPropertyOptional({ example: 100 })
//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   @Max(1000)
//   level?: number;

//   @ApiPropertyOptional({ example: false })
//   @IsOptional()
//   @IsBoolean()
//   isSystemRole?: boolean;
// }
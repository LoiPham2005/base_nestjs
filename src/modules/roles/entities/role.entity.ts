// // ============================================
// // src/modules/roles/entities/role.entity.ts
// // ============================================
// import { Entity, Column, OneToMany } from 'typeorm';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { BaseEntity } from '../../../common/entities/base.entity';
// import { UserRole } from '../../users/entities/user-role.entity';

// export interface Permission {
//   resource: string;
//   actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
//   conditions?: Record<string, any>;
// }

// @Entity('roles')
// export class Role extends BaseEntity {
//   @ApiProperty({
//     description: 'Role name',
//     example: 'Administrator',
//   })
//   @Column({ name: 'role_name', unique: true, length: 50 })
//   roleName: string;

//   @ApiProperty({
//     description: 'Role code',
//     example: 'admin',
//   })
//   @Column({ name: 'role_code', unique: true, length: 50 })
//   roleCode: string;

//   @ApiPropertyOptional({
//     description: 'Role description',
//   })
//   @Column({ type: 'text', nullable: true })
//   description?: string;

//   @ApiProperty({
//     description: 'Role permissions',
//   })
//   @Column({ type: 'jsonb', default: [] })
//   permissions: Permission[];

//   @ApiProperty({
//     description: 'Role level (higher = more privileged)',
//     example: 0,
//   })
//   @Column({ type: 'int', default: 0 })
//   level: number;

//   @ApiProperty({
//     description: 'Is system role (cannot be deleted)',
//     example: false,
//   })
//   @Column({ name: 'is_system_role', type: 'boolean', default: false })
//   isSystemRole: boolean;

//   @ApiProperty({
//     description: 'Is active',
//     example: true,
//   })
//   @Column({ name: 'is_active', type: 'boolean', default: true })
//   isActive: boolean;

//   // Relations
//   @OneToMany(() => UserRole, (userRole) => userRole.role)
//   userRoles: UserRole[];
// }
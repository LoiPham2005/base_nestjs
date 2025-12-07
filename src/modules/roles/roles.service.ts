// // ============================================
// // src/modules/roles/roles.service.ts
// // ============================================
// import { Injectable } from '@nestjs/common';
// import {
//   NotFoundException,
//   ConflictException,
//   BadRequestException,
// } from '../../common/exceptions/custom-exceptions';
// import { Role } from './entities/role.entity';
// import { RoleRepository } from './repositories/role.repository';
// import { UserRoleRepository } from '../users/repositories/user-role.repository';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Injectable()
// export class RolesService {
//   constructor(
//     private readonly roleRepository: RoleRepository,
//     private readonly userRoleRepository: UserRoleRepository,
//   ) {}

//   async findAll(): Promise<Role[]> {
//     return this.roleRepository.find({
//       order: { level: 'DESC' },
//     });
//   }

//   async findActive(): Promise<Role[]> {
//     return this.roleRepository.findActiveRoles();
//   }

//   async findById(id: string): Promise<Role> {
//     const role = await this.roleRepository.findById(id);
//     if (!role) {
//       throw new NotFoundException('Role not found');
//     }
//     return role;
//   }

//   async findByCode(roleCode: string): Promise<Role> {
//     const role = await this.roleRepository.findByCode(roleCode);
//     if (!role) {
//       throw new NotFoundException('Role not found');
//     }
//     return role;
//   }

//   async create(createRoleDto: CreateRoleDto): Promise<Role> {
//     // Check if role code exists
//     if (await this.roleRepository.existsByCode(createRoleDto.roleCode)) {
//       throw new ConflictException('Role code already exists');
//     }

//     // Check if role name exists
//     if (await this.roleRepository.existsByName(createRoleDto.roleName)) {
//       throw new ConflictException('Role name already exists');
//     }

//     const role = this.roleRepository.create(createRoleDto);
//     return this.roleRepository.save(role);
//   }

//   async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
//     const role = await this.findById(id);

//     // Prevent updating system roles
//     if (role.isSystemRole && updateRoleDto.permissions) {
//       throw new BadRequestException('Cannot modify system role permissions');
//     }

//     // Check role name uniqueness
//     if (updateRoleDto.roleName && updateRoleDto.roleName !== role.roleName) {
//       if (await this.roleRepository.existsByName(updateRoleDto.roleName)) {
//         throw new ConflictException('Role name already exists');
//       }
//     }

//     Object.assign(role, updateRoleDto);
//     return this.roleRepository.save(role);
//   }

//   async remove(id: string): Promise<void> {
//     const role = await this.findById(id);

//     // Prevent deleting system roles
//     if (role.isSystemRole) {
//       throw new BadRequestException('Cannot delete system role');
//     }

//     // Check if role is assigned to users
//     const userCount = await this.userRoleRepository.countUsersByRoleId(id);
//     if (userCount > 0) {
//       throw new BadRequestException(`Cannot delete role assigned to ${userCount} users`);
//     }

//     await this.roleRepository.remove(role);
//   }

//   async activate(id: string): Promise<Role> {
//     const role = await this.findById(id);
//     role.isActive = true;
//     return this.roleRepository.save(role);
//   }

//   async deactivate(id: string): Promise<Role> {
//     const role = await this.findById(id);
    
//     if (role.isSystemRole) {
//       throw new BadRequestException('Cannot deactivate system role');
//     }

//     role.isActive = false;
//     return this.roleRepository.save(role);
//   }

//   async getSystemRoles(): Promise<Role[]> {
//     return this.roleRepository.getSystemRoles();
//   }

//   async getRoleWithUsers(id: string): Promise<Role> {
//     const role = await this.roleRepository.getRoleWithUsers(id);
//     if (!role) {
//       throw new NotFoundException('Role not found');
//     }
//     return role;
//   }

//   async updatePermissions(id: string, permissions: any[]): Promise<Role> {
//     const role = await this.findById(id);
    
//     if (role.isSystemRole) {
//       throw new BadRequestException('Cannot modify system role permissions');
//     }

//     role.permissions = permissions;
//     return this.roleRepository.save(role);
//   }
// }
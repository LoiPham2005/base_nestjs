// // ============================================
// // src/modules/roles/repositories/role.repository.ts
// // ============================================
// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository, In } from 'typeorm';
// import { Role } from '../entities/role.entity';

// @Injectable()
// export class RoleRepository extends Repository<Role> {
//   constructor(private dataSource: DataSource) {
//     super(Role, dataSource.createEntityManager());
//   }

//   async findById(id: string): Promise<Role | null> {
//     return this.findOne({ where: { id } });
//   }

//   async findByCode(roleCode: string): Promise<Role | null> {
//     return this.findOne({ where: { roleCode } });
//   }

//   async findByName(roleName: string): Promise<Role | null> {
//     return this.findOne({ where: { roleName } });
//   }

//   async findByCodes(roleCodes: string[]): Promise<Role[]> {
//     return this.find({ where: { roleCode: In(roleCodes) } });
//   }

//   async findActiveRoles(): Promise<Role[]> {
//     return this.find({
//       where: { isActive: true },
//       order: { level: 'DESC' },
//     });
//   }

//   async findByIds(ids: string[]): Promise<Role[]> {
//     return this.find({ where: { id: In(ids) } });
//   }

//   async existsByCode(roleCode: string): Promise<boolean> {
//     const count = await this.count({ where: { roleCode } });
//     return count > 0;
//   }

//   async existsByName(roleName: string): Promise<boolean> {
//     const count = await this.count({ where: { roleName } });
//     return count > 0;
//   }

//   async getSystemRoles(): Promise<Role[]> {
//     return this.find({
//       where: { isSystemRole: true },
//       order: { level: 'DESC' },
//     });
//   }

//   async getRoleWithUsers(roleId: string): Promise<Role | null> {
//     return this.findOne({
//       where: { id: roleId },
//       relations: ['userRoles', 'userRoles.user'],
//     });
//   }
// }
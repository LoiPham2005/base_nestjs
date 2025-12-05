// ============================================
// src/common/enums/role.enum.ts
// ============================================
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

export const RoleHierarchy: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 100,
  [Role.ADMIN]: 80,
  [Role.MANAGER]: 60,
  [Role.USER]: 40,
  [Role.GUEST]: 20,
};
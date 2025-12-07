// ============================================
// src/modules/users/repositories/user-role.repository.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(private dataSource: DataSource) {
    super(UserRole, dataSource.createEntityManager());
  }

  async findByUserIdAndRoleId(userId: string, roleId: string): Promise<UserRole | null> {
    return this.findOne({
      where: { userId, roleId },
      relations: ['role'],
    });
  }

  async findUserRoles(userId: string): Promise<UserRole[]> {
    return this.find({
      where: { userId },
      relations: ['role'],
      order: { isPrimary: 'DESC', assignedAt: 'DESC' },
    });
  }

  async findValidUserRoles(userId: string): Promise<UserRole[]> {
    const roles = await this.findUserRoles(userId);
    return roles.filter(ur => ur.isValid);
  }

  async findPrimaryRole(userId: string): Promise<UserRole | null> {
    return this.findOne({
      where: { userId, isPrimary: true },
      relations: ['role'],
    });
  }

  async findRoleUsers(roleId: string): Promise<UserRole[]> {
    return this.find({
      where: { roleId },
      relations: ['user'],
      order: { assignedAt: 'DESC' },
    });
  }

  async countUsersByRoleId(roleId: string): Promise<number> {
    return this.count({
      where: { roleId },
    });
  }

  async findExpiredAssignments(): Promise<UserRole[]> {
    return this.query(`
      SELECT * FROM user_roles 
      WHERE expires_at IS NOT NULL 
      AND expires_at < NOW()
    `);
  }

  async removeExpiredAssignments(): Promise<number> {
    const result = await this.delete({
      expiresAt: In([]),
    });
    return result.affected || 0;
  }

  async assignRole(
    userId: string,
    roleId: string,
    assignedBy: string,
    isPrimary: boolean = false,
    expiresAt?: Date,
    extraPermissions?: any[],
  ): Promise<UserRole> {
    // If setting as primary, unset other primary roles
    if (isPrimary) {
      await this.update(
        { userId, isPrimary: true },
        { isPrimary: false },
      );
    }

    const userRole = this.create({
      userId,
      roleId,
      assignedBy,
      isPrimary,
      expiresAt,
      extraPermissions,
    });

    return this.save(userRole);
  }

  async getUserRolesWithPermissions(userId: string): Promise<any> {
    return this.query(`
      SELECT 
        ur.id,
        ur.user_id,
        ur.role_id,
        ur.is_primary,
        ur.extra_permissions,
        ur.expires_at,
        r.role_name,
        r.role_code,
        r.permissions,
        r.level
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1 
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
      ORDER BY ur.is_primary DESC, ur.assigned_at DESC
    `, [userId]);
  }

  async findExpiringRoles(daysThreshold: number = 7): Promise<UserRole[]> {
    const query = `
      SELECT * FROM user_roles 
      WHERE expires_at IS NOT NULL 
        AND expires_at > NOW()
        AND expires_at <= NOW() + INTERVAL '${daysThreshold} days'
    `;
    return this.query(query);
  }

  async updateExtraPermissions(
    userId: string,
    roleId: string,
    extraPermissions: any[],
  ): Promise<UserRole | null> {
    const userRole = await this.findByUserIdAndRoleId(userId, roleId);
    if (!userRole) return null;

    userRole.extraPermissions = extraPermissions;
    return this.save(userRole);
  }

  async extendRoleExpiry(
    userId: string,
    roleId: string,
    expiresAt: Date,
  ): Promise<UserRole | null> {
    const userRole = await this.findByUserIdAndRoleId(userId, roleId);
    if (!userRole) return null;

    userRole.expiresAt = expiresAt;
    return this.save(userRole);
  }
}
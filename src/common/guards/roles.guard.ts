// ============================================
// src/common/guards/roles.guard.ts
// ============================================
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role, RoleHierarchy } from '../enums/role.enum';
import { ForbiddenException } from '../exceptions/custom-exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    const hasRole = this.checkRoleHierarchy(user.roles, requiredRoles);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return hasRole;
  }

  private checkRoleHierarchy(userRoles: Role[], requiredRoles: Role[]): boolean {
    const maxUserRole = Math.max(
      ...userRoles.map((role) => RoleHierarchy[role] || 0),
    );

    const minRequiredRole = Math.min(
      ...requiredRoles.map((role) => RoleHierarchy[role] || 0),
    );

    return maxUserRole >= minRequiredRole;
  }
}
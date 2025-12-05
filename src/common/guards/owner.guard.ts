// ============================================
// src/common/guards/owner.guard.ts
// ============================================
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '../exceptions/custom-exceptions';
import { Role } from '../enums/role.enum';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceOwnerId = request.params.userId || request.params.id;

    // Admin can access all resources
    if (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.SUPER_ADMIN)) {
      return true;
    }

    // Check if user owns the resource
    if (user.id !== resourceOwnerId) {
      throw new ForbiddenException(
        'You can only access your own resources',
      );
    }

    return true;
  }
}
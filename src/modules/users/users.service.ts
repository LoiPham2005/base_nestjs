// ============================================
// src/modules/users/users.service.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { HashUtil } from '../../common/utils/hash.util';
import { MESSAGES } from '../../common/constants/messages.constant';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '../../common/exceptions/custom-exceptions';
import { UserStatus } from '../../common/enums/status.enum';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';
import { RoleRepository } from '../roles/repositories/role.repository';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAll(query: UserQueryDto): Promise<PaginationResult<User>> {
    return this.userRepository.findAllWithPagination(query);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findByPhone(phone);
  }

  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.userRepository.findByEmailOrPhone(identifier);
  }

  async create(createUserDto: CreateUserDto, assignedRoleCode = 'user'): Promise<User> {
    // Check if email exists
    if (await this.userRepository.existsByEmail(createUserDto.email)) {
      throw new ConflictException('Email already exists');
    }

    // Check if phone exists
    if (await this.userRepository.existsByPhone(createUserDto.phone)) {
      throw new ConflictException('Phone number already exists');
    }

    // Hash password
    const passwordHash = await HashUtil.hashPassword(createUserDto.password);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash,
      status: UserStatus.INACTIVE,
      emailVerified: false,
      phoneVerified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign default role
    const defaultRole = await this.roleRepository.findByCode(assignedRoleCode);
    if (defaultRole) {
      await this.userRoleRepository.assignRole(
        savedUser.id,
        defaultRole.id,
        savedUser.id,
        true, // isPrimary
      );
    }

    return this.findById(savedUser.id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async adminUpdate(id: string, updateUserDto: AdminUpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Check phone uniqueness if changed
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      if (await this.userRepository.existsByPhone(updateUserDto.phone)) {
        throw new ConflictException('Phone number already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softDelete(user.id);
  }

  async activate(id: string): Promise<User> {
    const user = await this.findById(id);
    user.status = UserStatus.ACTIVE;
    return this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findById(id);
    user.status = UserStatus.INACTIVE;
    return this.userRepository.save(user);
  }

  async suspend(id: string): Promise<User> {
    const user = await this.findById(id);
    user.status = UserStatus.SUSPENDED;
    return this.userRepository.save(user);
  }

  async ban(id: string): Promise<User> {
    const user = await this.findById(id);
    user.status = UserStatus.BANNED;
    return this.userRepository.save(user);
  }

  async verifyEmail(id: string): Promise<User> {
    const user = await this.findById(id);
    user.emailVerified = true;
    if (!user.phoneVerified) {
      user.status = UserStatus.ACTIVE;
    }
    return this.userRepository.save(user);
  }

  async verifyPhone(id: string): Promise<User> {
    const user = await this.findById(id);
    user.phoneVerified = true;
    if (!user.emailVerified) {
      user.status = UserStatus.ACTIVE;
    }
    return this.userRepository.save(user);
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    user.passwordHash = await HashUtil.hashPassword(newPassword);
    await this.userRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.updateLastLogin(id);
  }

  // Role management
  async assignRole(userId: string, assignRoleDto: AssignRoleDto, assignedBy: string): Promise<User> {
    const user = await this.findById(userId);
    const role = await this.roleRepository.findById(assignRoleDto.roleId);
    
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if already assigned
    const existingAssignment = await this.userRoleRepository.findByUserIdAndRoleId(userId, role.id);
    if (existingAssignment) {
      throw new ConflictException('Role already assigned to user');
    }

    await this.userRoleRepository.assignRole(
      userId,
      role.id,
      assignedBy,
      assignRoleDto.isPrimary,
      assignRoleDto.expiresAt,
      assignRoleDto.extraPermissions,
    );

    return this.findById(userId);
  }

  async removeRole(userId: string, roleId: string): Promise<User> {
    const userRole = await this.userRoleRepository.findByUserIdAndRoleId(userId, roleId);
    
    if (!userRole) {
      throw new NotFoundException('User role assignment not found');
    }

    await this.userRoleRepository.remove(userRole);
    return this.findById(userId);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    return this.userRepository.getUserRoles(userId);
  }

  async getUserPermissions(userId: string): Promise<any[]> {
    return this.userRepository.getUserPermissions(userId);
  }

  async updatePreferences(id: string, preferences: Record<string, any>): Promise<User> {
    const user = await this.findById(id);
    user.preferences = { ...user.preferences, ...preferences };
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async countByStatus(status: UserStatus): Promise<number> {
    return this.userRepository.countByStatus(status);
  }
}
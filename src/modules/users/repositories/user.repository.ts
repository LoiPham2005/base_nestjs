// ============================================
// src/modules/users/repositories/user.repository.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import { UserQueryDto } from '../dto/user-query.dto';
import { UserStatus } from '../../../common/enums/status.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({ 
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ 
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.findOne({ 
      where: { phone },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<User | null> {
    return this.findOne({
      where: [
        { email: emailOrPhone },
        { phone: emailOrPhone },
      ],
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async findAllWithPagination(query: UserQueryDto): Promise<PaginationResult<User>> {
    const { page = 1, limit = 10, search, orderBy = 'createdAt', orderDirection = 'DESC', status } = query;

    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role');

    if (search) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    queryBuilder
      .orderBy(`user.${orderBy}`, orderDirection)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, totalItems] = await queryBuilder.getManyAndCount();

    return new PaginationResult(data, totalItems, page, limit);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.find({
      where: { status: UserStatus.ACTIVE },
      relations: ['userRoles', 'userRoles.role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByIds(ids: string[]): Promise<User[]> {
    return this.find({
      where: { id: In(ids) },
      relations: ['userRoles', 'userRoles.role'],
    });
  }

  async countByStatus(status: UserStatus): Promise<number> {
    return this.count({ where: { status } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.count({ where: { phone } });
    return count > 0;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLoginAt: new Date() });
  }

  async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) return [];

    return user.userRoles
      .filter(ur => !ur.isExpired)
      .map(ur => ur.role.roleCode);
  }

  async getUserPermissions(userId: string): Promise<any[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) return [];

    const permissions: any[] = [];
    
    user.userRoles
      .filter(ur => !ur.isExpired)
      .forEach(ur => {
        permissions.push(...ur.role.permissions);
        if (ur.extraPermissions) {
          permissions.push(...ur.extraPermissions);
        }
      });

    return permissions;
  }
}
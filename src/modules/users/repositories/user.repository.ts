// ============================================
// src/modules/users/repositories/user.repository.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginationResult } from '../../../common/interfaces/pagination.interface';
import { UserQueryDto } from '../dto/user-query.dto';
import { UserStatus } from '@/common/enums/status.enum';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findById(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    async findAllWithPagination(query: UserQueryDto): Promise<PaginationResult<User>> {
        const { page = 1, limit = 10, search, orderBy = 'createdAt', orderDirection = 'DESC' } = query;

        const queryBuilder = this.createQueryBuilder('user');

        if (search) {
            queryBuilder.where(
                '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
                { search: `%${search}%` },
            );
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
            order: { createdAt: 'DESC' },
        });
    }

    async countByStatus(status: UserStatus): Promise<number> {
        return this.count({ where: { status } });
    }

    async createEntity(data: Partial<User>): Promise<User> {
        const entity = this.create(data);
        return this.save(entity);
    }
}
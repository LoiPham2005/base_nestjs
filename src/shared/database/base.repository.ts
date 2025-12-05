// ============================================
// src/shared/database/base.repository.ts
// ============================================
import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IPaginationOptions, PaginationResult } from '../../common/interfaces/pagination.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
  async findAll(): Promise<T[]> {
    return this.find();
  }

  async findById(id: string): Promise<T | null> {
    return this.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return this.save(entity);
  }

  async updateEntity(id: string, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.update(id, data);
    return this.findById(id);
  }

  async deleteEntity(id: string): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async paginate(
    options: IPaginationOptions,
    findOptions?: FindManyOptions<T>,
  ): Promise<PaginationResult<T>> {
    const { page, limit, orderBy, orderDirection } = options;
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findAndCount({
      ...findOptions,
      skip,
      take: limit,
      order: orderBy ? { [orderBy]: orderDirection } : undefined,
    } as FindManyOptions<T>);

    return new PaginationResult(data, totalItems, page, limit);
  }

  // async exists(where: FindOptionsWhere<T>): Promise<boolean> {
  //   const count = await this.count({ where });
  //   return count > 0;
  // }

  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }

  async bulkCreate(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.create(data);
    return this.save(entities);
  }

  async bulkUpdate(ids: string[], data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.update(ids, data);
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await this.delete(ids);
  }
}
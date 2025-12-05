// ============================================
// src/modules/users/users.service.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { HashUtil } from '../../common/utils/hash.util';
import { MESSAGES } from '../../common/constants/messages.constant';
import {
  NotFoundException,
  ConflictException,
} from '../../common/exceptions/custom-exceptions';
import { UserStatus } from '../../common/enums/status.enum';
import { PaginationResult } from '../../common/interfaces/pagination.interface';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserQueryDto } from './dto/user-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await HashUtil.hashPassword(createUserDto.password);

    const user = await this.userRepository.createEntity({
      ...createUserDto,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await HashUtil.hashPassword(updateUserDto.password);
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

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
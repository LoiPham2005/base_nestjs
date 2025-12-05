// ============================================
// src/modules/users/dto/user-query.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';
import { UserOrderBy } from '../../../common/enums/order-by.enum';

export class UserQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({
    enum: UserOrderBy,
    default: UserOrderBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(UserOrderBy)
  orderBy?: UserOrderBy = UserOrderBy.CREATED_AT;
}
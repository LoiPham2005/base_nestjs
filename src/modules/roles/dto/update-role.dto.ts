// ============================================
// src/modules/roles/dto/update-role.dto.ts
// ============================================
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['roleCode', 'isSystemRole'] as const),
) {}
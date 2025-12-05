// ============================================
// src/modules/auth/dto/change-password.dto.ts
// ============================================
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';
import { REGEX_PATTERNS } from '../../../common/constants/regex.constant';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Current password',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(REGEX_PATTERNS.PASSWORD)
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password confirmation',
  })
  @IsString()
  @Match('newPassword')
  newPasswordConfirmation: string;
}
// ============================================
// src/modules/auth/auth.service.ts
// ============================================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { HashUtil } from '../../common/utils/hash.util';
import { DateUtil } from '../../common/utils/date.util';
// import { RedisService } from '../../shared/redis/redis.service';
import { MESSAGES } from '../../common/constants/messages.constant';
import { CACHE_KEYS } from '../../common/constants/app.constant';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '../../common/exceptions/custom-exceptions';
import { UserStatus } from '../../common/enums/status.enum';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    // private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(MESSAGES.ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await HashUtil.hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = HashUtil.generateToken();

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      roles: [Role.USER],
      status: UserStatus.PENDING_VERIFICATION,
      emailVerificationToken,
    });

    await this.userRepository.save(user);

    // TODO: Send verification email
    // await this.mailService.sendVerificationEmail(user.email, emailVerificationToken);

    return {
      message: MESSAGES.REGISTER_SUCCESS,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await HashUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return {
      message: MESSAGES.LOGIN_SUCCESS,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Invalidate tokens in Redis
    // await this.redisService.del(CACHE_KEYS.USER(userId));

    return {
      message: MESSAGES.LOGOUT_SUCCESS,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Verify old password
    const isPasswordValid = await HashUtil.comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await HashUtil.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      message: MESSAGES.PASSWORD_CHANGED,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return {
        message: MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      };
    }

    // Generate reset token
    const resetToken = HashUtil.generateToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = DateUtil.addHours(new Date(), 1);
    await this.userRepository.save(user);

    // TODO: Send reset email
    // await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (DateUtil.isPast(user.passwordResetExpires)) {
      throw new BadRequestException('Reset token has expired');
    }

    // Update password
    const hashedPassword = await HashUtil.hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;  // Changed from null to undefined
    user.passwordResetExpires = undefined;  // Changed from null to undefined
    await this.userRepository.save(user);

    return {
      message: 'Password reset successful',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.emailVerificationToken = undefined;  // Changed from null to undefined
    await this.userRepository.save(user);

    return {
      message: MESSAGES.EMAIL_VERIFIED,
    };
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 1 day in seconds
    };
  }
}
// ============================================
// src/common/configs/jwt.config.ts
// ============================================
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRATION || '1d' as any,
      issuer: process.env.JWT_ISSUER || 'nestjs-template',
      audience: process.env.JWT_AUDIENCE || 'nestjs-template-users',
    },
  }),
);
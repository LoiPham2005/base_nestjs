// ============================================
// src/common/configs/app.config.ts
// ============================================
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigins: process.env.CORS_ORIGINS || '*',
  appName: process.env.APP_NAME || 'NestJS Base Template',
  appVersion: process.env.APP_VERSION || '1.0.0',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
}));
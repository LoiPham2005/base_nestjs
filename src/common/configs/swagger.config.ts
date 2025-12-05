// ============================================
// src/common/configs/swagger.config.ts
// ============================================
import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('NestJS Base Template API')
  .setDescription('Enterprise-grade NestJS API template with best practices')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addTag('Authentication', 'Authentication endpoints')
  .addTag('Users', 'User management endpoints')
  .addServer('http://localhost:3000', 'Local Development')
  .addServer('https://api-staging.example.com', 'Staging')
  .addServer('https://api.example.com', 'Production')
  .build();
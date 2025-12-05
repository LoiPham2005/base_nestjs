// ============================================
// src/common/configs/database.config.ts
// ============================================
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '123456',
    database: process.env.DATABASE_NAME || 'nestjs_template',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../../shared/database/migrations/*{.ts,.js}'],
    migrationsRun: false,
    ssl: process.env.DATABASE_SSL === 'true' ? {
      rejectUnauthorized: false,
    } : false,
    extra: {
      max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
      min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 30000,
    },
  }),
);

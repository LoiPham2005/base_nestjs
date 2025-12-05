// ============================================
// src/common/interfaces/config.interface.ts
// ============================================
export interface IAppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigins: string;
  appName: string;
  appVersion: string;
  frontendUrl: string;
}

export interface IDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface IJwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  ttl: number;
}
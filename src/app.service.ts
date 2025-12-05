// ============================================
// src/app.service.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './shared/database/database.service';
// import { RedisService } from './shared/redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    // private redisService: RedisService,
  ) {}

  getApiInfo() {
    return {
      name: this.configService.get('APP_NAME'),
      version: this.configService.get('APP_VERSION'),
      environment: this.configService.get('NODE_ENV'),
      timestamp: new Date().toISOString(),
      documentation: '/api/docs',
      endpoints: {
        health: '/health',
        ping: '/ping',
        auth: '/api/auth',
        users: '/api/users',
      },
    };
  }

  async getHealthCheck() {
    const startTime = Date.now();

    // Check database connection
    const databaseHealthy = await this.databaseService.checkConnection();

    // Check Redis connection
    // const redisHealthy = await this.checkRedisConnection();

    const responseTime = Date.now() - startTime;

    const status = databaseHealthy 
    // && redisHealthy
    ? 'healthy' : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      services: {
        database: {
          status: databaseHealthy ? 'up' : 'down',
        },
        redis: {
          // status: redisHealthy ? 'up' : 'down',
        },
      },
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        percentage: `${Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%`,
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        environment: this.configService.get('NODE_ENV'),
      },
    };
  }

  // private async checkRedisConnection(): Promise<boolean> {
  //   try {
  //     await this.redisService.set('health-check', 'ok', 10);
  //     const result = await this.redisService.get('health-check');
  //     return result === 'ok';
  //   } catch (error) {
  //     return false;
  //   }
  // }
}
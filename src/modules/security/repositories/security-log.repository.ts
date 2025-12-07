// // ============================================
// // src/modules/security/repositories/security-log.repository.ts
// // ============================================
// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository, Between, MoreThanOrEqual } from 'typeorm';
// import { SecurityLog, SecurityLogType, SecurityLogStatus } from '../entities/security-log.entity';

// @Injectable()
// export class SecurityLogRepository extends Repository<SecurityLog> {
//   constructor(private dataSource: DataSource) {
//     super(SecurityLog, dataSource.createEntityManager());
//   }

//   async findByUserId(userId: string, limit: number = 100): Promise<SecurityLog[]> {
//     return this.find({
//       where: { userId },
//       order: { createdAt: 'DESC' },
//       take: limit,
//       relations: ['user'],
//     });
//   }

//   async findUserLogsByType(
//     userId: string,
//     logType: SecurityLogType,
//     limit: number = 50,
//   ): Promise<SecurityLog[]> {
//     return this.find({
//       where: { userId, logType },
//       order: { createdAt: 'DESC' },
//       take: limit,
//     });
//   }

//   async findFailedLoginAttempts(
//     userId: string,
//     minutes: number = 15,
//   ): Promise<SecurityLog[]> {
//     const since = new Date(Date.now() - minutes * 60 * 1000);
//     return this.find({
//       where: {
//         userId,
//         logType: SecurityLogType.FAILED_LOGIN_ATTEMPT,
//         createdAt: MoreThanOrEqual(since),
//       },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findSuspiciousActivity(
//     userId: string,
//     hours: number = 24,
//   ): Promise<SecurityLog[]> {
//     const since = new Date(Date.now() - hours * 60 * 60 * 1000);
//     return this.find({
//       where: {
//         userId,
//         status: SecurityLogStatus.SUSPICIOUS,
//         createdAt: MoreThanOrEqual(since),
//       },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findLoginsByIpAddress(
//     ipAddress: string,
//     limit: number = 50,
//   ): Promise<SecurityLog[]> {
//     return this.find({
//       where: {
//         ipAddress,
//         logType: SecurityLogType.LOGIN,
//       },
//       order: { createdAt: 'DESC' },
//       take: limit,
//       relations: ['user'],
//     });
//   }

//   async findFailedAttemptsByIp(
//     ipAddress: string,
//     minutes: number = 15,
//   ): Promise<SecurityLog[]> {
//     const since = new Date(Date.now() - minutes * 60 * 1000);
//     return this.find({
//       where: {
//         ipAddress,
//         logType: SecurityLogType.FAILED_LOGIN_ATTEMPT,
//         createdAt: MoreThanOrEqual(since),
//       },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findUnusualLoginLocations(
//     userId: string,
//     hours: number = 24,
//   ): Promise<SecurityLog[]> {
//     const since = new Date(Date.now() - hours * 60 * 60 * 1000);
//     return this.find({
//       where: {
//         userId,
//         logType: SecurityLogType.UNUSUAL_LOGIN_LOCATION,
//         createdAt: MoreThanOrEqual(since),
//       },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async countFailedAttempts(userId: string, minutes: number = 15): Promise<number> {
//     return this.count({
//       where: {
//         userId,
//         logType: SecurityLogType.FAILED_LOGIN_ATTEMPT,
//         createdAt: MoreThanOrEqual(new Date(Date.now() - minutes * 60 * 1000)),
//       },
//     });
//   }

//   async findLogsByDateRange(
//     userId: string,
//     startDate: Date,
//     endDate: Date,
//   ): Promise<SecurityLog[]> {
//     return this.find({
//       where: {
//         userId,
//         createdAt: Between(startDate, endDate),
//       },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   async findBlockedActivities(limit: number = 100): Promise<SecurityLog[]> {
//     return this.find({
//       where: { status: SecurityLogStatus.BLOCKED },
//       order: { createdAt: 'DESC' },
//       take: limit,
//       relations: ['user'],
//     });
//   }

//   async getSecurityStats(userId: string, days: number = 30): Promise<any> {
//     const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

//     const stats = await this.query(`
//       SELECT 
//         log_type,
//         COUNT(*) as count,
//         status
//       FROM security_logs
//       WHERE user_id = $1 
//         AND created_at >= $2
//       GROUP BY log_type, status
//       ORDER BY count DESC
//     `, [userId, since]);

//     return stats;
//   }

//   async getIpAddressHistory(userId: string, limit: number = 20): Promise<any[]> {
//     return this.query(`
//       SELECT DISTINCT
//         ip_address,
//         location,
//         COUNT(*) as login_count,
//         MAX(created_at) as last_seen
//       FROM security_logs
//       WHERE user_id = $1 
//         AND log_type = 'login'
//         AND ip_address IS NOT NULL
//       GROUP BY ip_address, location
//       ORDER BY last_seen DESC
//       LIMIT $2
//     `, [userId, limit]);
//   }

//   async cleanup(daysToKeep: number = 90): Promise<number> {
//     const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
//     const result = await this.delete({
//       createdAt: MoreThanOrEqual(cutoffDate),
//     });
//     return result.affected || 0;
//   }
// }
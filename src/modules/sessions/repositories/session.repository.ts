// // ============================================
// // src/modules/sessions/repositories/session.repository.ts
// // ============================================
// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { UserSession } from '../entities/user-session.entity';

// @Injectable()
// export class SessionRepository extends Repository<UserSession> {
//   constructor(private dataSource: DataSource) {
//     super(UserSession, dataSource.createEntityManager());
//   }

//   async findBySessionId(sessionId: string): Promise<UserSession | null> {
//     return this.findOne({
//       where: { sessionId },
//       relations: ['user'],
//     });
//   }

//   async findByRefreshTokenHash(tokenHash: string): Promise<UserSession | null> {
//     return this.findOne({
//       where: { refreshTokenHash: tokenHash },
//       relations: ['user'],
//     });
//   }

//   async findUserSessions(userId: string): Promise<UserSession[]> {
//     return this.find({
//       where: { userId },
//       order: { lastActivityAt: 'DESC' },
//     });
//   }

//   async findUserActiveSessions(userId: string): Promise<UserSession[]> {
//     return this.find({
//       where: { userId, isActive: true },
//       order: { lastActivityAt: 'DESC' },
//     });
//   }

//   async findValidSessions(userId: string): Promise<UserSession[]> {
//     const sessions = await this.findUserActiveSessions(userId);
//     return sessions.filter(s => s.isValid);
//   }

//   async countUserSessions(userId: string): Promise<number> {
//     return this.count({ where: { userId } });
//   }

//   async countUserActiveSessions(userId: string): Promise<number> {
//     return this.count({ where: { userId, isActive: true } });
//   }

//   async findExpiredSessions(): Promise<UserSession[]> {
//     return this.query(`
//       SELECT * FROM user_sessions 
//       WHERE expires_at < NOW()
//     `);
//   }

//   async deactivateSession(sessionId: string): Promise<void> {
//     await this.update(
//       { sessionId },
//       { isActive: false, revokedAt: new Date() },
//     );
//   }

//   async deactivateUserSessions(userId: string): Promise<number> {
//     const result = await this.update(
//       { userId, isActive: true },
//       { isActive: false, revokedAt: new Date() },
//     );
//     return result.affected || 0;
//   }

//   async deleteExpiredSessions(): Promise<number> {
//     const result = await this.delete({
//       expiresAt: new Date(),
//     });
//     return result.affected || 0;
//   }

//   async updateLastActivity(sessionId: string): Promise<void> {
//     await this.update(
//       { sessionId },
//       { lastActivityAt: new Date() },
//     );
//   }

//   async updateFcmToken(sessionId: string, fcmToken: string): Promise<void> {
//     await this.update(
//       { sessionId },
//       { fcmToken },
//     );
//   }

//   async findSessionsByDevice(userId: string, deviceName: string): Promise<UserSession[]> {
//     return this.query(`
//       SELECT * FROM user_sessions 
//       WHERE user_id = $1 
//         AND device_info->>'deviceName' = $2
//       ORDER BY last_activity_at DESC
//     `, [userId, deviceName]);
//   }

//   async findSessionsByIp(userId: string, ipAddress: string): Promise<UserSession[]> {
//     return this.query(`
//       SELECT * FROM user_sessions 
//       WHERE user_id = $1 
//         AND device_info->>'ipAddress' = $2
//       ORDER BY last_activity_at DESC
//     `, [userId, ipAddress]);
//   }
// }
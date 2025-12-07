// // ============================================
// // src/modules/sessions/sessions.service.ts
// // ============================================
// import { Injectable, Logger } from '@nestjs/common';
// import { SessionRepository } from './repositories/session.repository';
// import { UserSession, DeviceInfo } from './entities/user-session.entity';
// import { HashUtil } from '../../common/utils/hash.util';
// import { DateUtil } from '../../common/utils/date.util';
// import {
//   NotFoundException,
//   UnauthorizedException,
// } from '../../common/exceptions/custom-exceptions';

// @Injectable()
// export class SessionsService {
//   private readonly logger = new Logger(SessionsService.name);

//   constructor(private readonly sessionRepository: SessionRepository) {}

//   async createSession(
//     userId: string,
//     refreshToken: string,
//     deviceInfo: DeviceInfo,
//     fcmToken?: string,
//   ): Promise<UserSession> {
//     const sessionId = this.generateSessionId();
//     const refreshTokenHash = await HashUtil.hashPassword(refreshToken);
//     const expiresAt = DateUtil.addDays(new Date(), 7); // 7 days

//     const session = this.sessionRepository.create({
//       sessionId,
//       userId,
//       refreshTokenHash,
//       deviceInfo,
//       fcmToken,
//       expiresAt,
//       isActive: true,
//       lastActivityAt: new Date(),
//     });

//     const savedSession = await this.sessionRepository.save(session);
//     this.logger.log(`Session created: ${sessionId} for user: ${userId}`);

//     return savedSession;
//   }

//   async getSession(sessionId: string): Promise<UserSession> {
//     const session = await this.sessionRepository.findBySessionId(sessionId);
//     if (!session || !session.isValid) {
//       throw new NotFoundException('Session not found or expired');
//     }
//     return session;
//   }

//   async validateSession(sessionId: string, refreshTokenHash: string): Promise<UserSession> {
//     const session = await this.sessionRepository.findBySessionId(sessionId);
    
//     if (!session) {
//       throw new NotFoundException('Session not found');
//     }

//     if (!session.isValid) {
//       throw new UnauthorizedException('Session expired or revoked');
//     }

//     if (session.refreshTokenHash !== refreshTokenHash) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }

//     return session;
//   }

//   async getUserSessions(userId: string): Promise<UserSession[]> {
//     return this.sessionRepository.findUserSessions(userId);
//   }

//   async getUserActiveSessions(userId: string): Promise<UserSession[]> {
//     return this.sessionRepository.findUserActiveSessions(userId);
//   }

//   async updateLastActivity(sessionId: string): Promise<void> {
//     await this.sessionRepository.updateLastActivity(sessionId);
//   }

//   async updateFcmToken(sessionId: string, fcmToken: string): Promise<void> {
//     await this.sessionRepository.updateFcmToken(sessionId, fcmToken);
//   }

//   async revokeSession(sessionId: string): Promise<void> {
//     await this.sessionRepository.deactivateSession(sessionId);
//     this.logger.log(`Session revoked: ${sessionId}`);
//   }

//   async revokeUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
//     const sessions = await this.sessionRepository.findUserActiveSessions(userId);
//     let revokedCount = 0;

//     for (const session of sessions) {
//       if (excludeSessionId && session.sessionId === excludeSessionId) {
//         continue;
//       }
//       await this.revokeSession(session.sessionId);
//       revokedCount++;
//     }

//     this.logger.log(`Revoked ${revokedCount} sessions for user: ${userId}`);
//     return revokedCount;
//   }

//   async cleanupExpiredSessions(): Promise<number> {
//     const deletedCount = await this.sessionRepository.deleteExpiredSessions();
//     if (deletedCount > 0) {
//       this.logger.log(`Cleaned up ${deletedCount} expired sessions`);
//     }
//     return deletedCount;
//   }

//   async getSessionStats(userId: string): Promise<{
//     totalSessions: number;
//     activeSessions: number;
//     expiredSessions: number;
//     revokedSessions: number;
//   }> {
//     const allSessions = await this.sessionRepository.findUserSessions(userId);
//     const activeSessions = allSessions.filter(s => s.isActive && !s.isExpired && !s.isRevoked);
//     const expiredSessions = allSessions.filter(s => s.isExpired);
//     const revokedSessions = allSessions.filter(s => s.isRevoked);

//     return {
//       totalSessions: allSessions.length,
//       activeSessions: activeSessions.length,
//       expiredSessions: expiredSessions.length,
//       revokedSessions: revokedSessions.length,
//     };
//   }

//   async getDeviceHistory(userId: string): Promise<any[]> {
//     const sessions = await this.sessionRepository.findUserSessions(userId);
//     const deviceMap = new Map();

//     sessions.forEach(session => {
//       const deviceName = session.deviceInfo.deviceName || 'Unknown';
//       if (!deviceMap.has(deviceName)) {
//         deviceMap.set(deviceName, {
//           deviceName,
//           deviceType: session.deviceInfo.deviceType,
//           browser: session.deviceInfo.browser,
//           osVersion: session.deviceInfo.osVersion,
//           lastSeen: session.lastActivityAt,
//           sessionCount: 0,
//         });
//       }
//       deviceMap.get(deviceName).sessionCount++;
//     });

//     return Array.from(deviceMap.values()).sort((a, b) => 
//       new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
//     );
//   }

//   private generateSessionId(): string {
//     return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//   }
// }
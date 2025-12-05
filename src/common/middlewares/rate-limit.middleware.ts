// // ============================================
// // src/common/middlewares/rate-limit.middleware.ts
// // ============================================
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { CACHE_KEYS } from '../constants/app.constant';
// import { RedisService } from '@/shared/redis/redis.service';

// @Injectable()
// export class RateLimitMiddleware implements NestMiddleware {
//   constructor(private readonly redisService: RedisService) { }

//   async use(req: Request, res: Response, next: NextFunction) {
//     const ip = req.ip || '';
//     const endpoint = req.originalUrl || '';
//     const key = CACHE_KEYS.RATE_LIMIT(ip, endpoint);

//     const requestCount = await this.redisService.get(key);
//     const limit = 100; // requests per window
//     const window = 60; // seconds

//     if (requestCount) {
//       const count = parseInt(requestCount, 10);
//       if (count >= limit) {
//         return res.status(429).json({
//           success: false,
//           message: 'Too many requests',
//           error: {
//             code: 'RATE_LIMIT_EXCEEDED',
//             message: 'You have exceeded the rate limit. Please try again later.',
//           },
//           timestamp: new Date().toISOString(),
//         });
//       }
//       await this.redisService.increment(key);
//     } else {
//       await this.redisService.set(key, '1', window);
//     }

//     next();
//   }
// }
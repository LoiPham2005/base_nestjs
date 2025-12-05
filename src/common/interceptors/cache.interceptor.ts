// // ============================================
// // src/common/interceptors/cache.interceptor.ts
// // ============================================
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable, of } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Reflector } from '@nestjs/core';
// // import { RedisService } from '@/shared/redis/redis.service';

// export const CACHE_KEY_METADATA = 'cache_key';
// export const CACHE_TTL_METADATA = 'cache_ttl';

// @Injectable()
// export class CacheInterceptor implements NestInterceptor {
//   constructor(
//     private readonly redisService: RedisService,
//     private readonly reflector: Reflector,
//   ) {}

//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Promise<Observable<any>> {
//     const cacheKey = this.reflector.get<string>(
//       CACHE_KEY_METADATA,
//       context.getHandler(),
//     );

//     if (!cacheKey) {
//       return next.handle();
//     }

//     const request = context.switchToHttp().getRequest();
//     const key = this.generateCacheKey(cacheKey, request);

//     // Try to get from cache
//     const cachedData = await this.redisService.get(key);
//     if (cachedData) {
//       return of(JSON.parse(cachedData));
//     }

//     // If not in cache, execute handler and cache result
//     const ttl =
//       this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler()) ||
//       3600;

//     return next.handle().pipe(
//       tap(async (data) => {
//         await this.redisService.set(key, JSON.stringify(data), ttl);
//       }),
//     );
//   }

//   private generateCacheKey(baseKey: string, request: any): string {
//     const { url, query, params } = request;
//     const userId = request.user?.id || 'anonymous';
//     return `${baseKey}:${userId}:${url}:${JSON.stringify(query)}:${JSON.stringify(params)}`;
//   }
// }

// // Custom decorator for caching
// export const CacheResult = (key: string, ttl: number = 3600) => {
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//     Reflect.defineMetadata(CACHE_KEY_METADATA, key, descriptor.value);
//     Reflect.defineMetadata(CACHE_TTL_METADATA, ttl, descriptor.value);
//     return descriptor;
//   };
// };
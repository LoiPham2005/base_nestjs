// // ============================================
// // src/shared/redis/redis.service.ts
// // ============================================
// import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisService implements OnModuleDestroy {
//   private readonly logger = new Logger(RedisService.name);
//   private readonly client: Redis;

//   constructor(private readonly configService: ConfigService) {
//     this.client = new Redis({
//       host: this.configService.get('REDIS_HOST', 'localhost'),
//       port: this.configService.get('REDIS_PORT', 6379),
//       password: this.configService.get('REDIS_PASSWORD'),
//       db: this.configService.get('REDIS_DB', 0),
//       maxRetriesPerRequest: 3,
//       enableReadyCheck: true,
//       enableOfflineQueue: false,
//       retryStrategy: (times) => {
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//       },
//     });

//     this.client.on('connect', () => {
//       this.logger.log('Redis connected successfully');
//     });

//     this.client.on('error', (error) => {
//       this.logger.error('Redis connection error:', error);
//     });

//     this.client.on('close', () => {
//       this.logger.warn('Redis connection closed');
//     });
//   }

//   onModuleDestroy() {
//     this.client.disconnect();
//   }

//   getClient(): Redis {
//     return this.client;
//   }

//   /**
//    * Get value by key
//    */
//   async get(key: string): Promise<string | null> {
//     try {
//       return await this.client.get(key);
//     } catch (error) {
//       this.logger.error(`Error getting key ${key}:`, error);
//       return null;
//     }
//   }

//   /**
//    * Set value with optional expiration
//    */
//   async set(key: string, value: string, ttl?: number): Promise<void> {
//     try {
//       if (ttl) {
//         await this.client.setex(key, ttl, value);
//       } else {
//         await this.client.set(key, value);
//       }
//     } catch (error) {
//       this.logger.error(`Error setting key ${key}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Delete key(s)
//    */
//   async del(key: string | string[]): Promise<number> {
//     try {
//       const keys = Array.isArray(key) ? key : [key];
//       return await this.client.del(...keys);
//     } catch (error) {
//       this.logger.error(`Error deleting key(s):`, error);
//       return 0;
//     }
//   }

//   /**
//    * Check if key exists
//    */
//   async exists(key: string): Promise<boolean> {
//     try {
//       const result = await this.client.exists(key);
//       return result === 1;
//     } catch (error) {
//       this.logger.error(`Error checking key ${key}:`, error);
//       return false;
//     }
//   }

//   /**
//    * Set expiration time
//    */
//   async expire(key: string, seconds: number): Promise<boolean> {
//     try {
//       const result = await this.client.expire(key, seconds);
//       return result === 1;
//     } catch (error) {
//       this.logger.error(`Error setting expiration for ${key}:`, error);
//       return false;
//     }
//   }

//   /**
//    * Get time to live
//    */
//   async ttl(key: string): Promise<number> {
//     try {
//       return await this.client.ttl(key);
//     } catch (error) {
//       this.logger.error(`Error getting TTL for ${key}:`, error);
//       return -1;
//     }
//   }

//   /**
//    * Increment value
//    */
//   async increment(key: string, value: number = 1): Promise<number> {
//     try {
//       return await this.client.incrby(key, value);
//     } catch (error) {
//       this.logger.error(`Error incrementing key ${key}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Decrement value
//    */
//   async decrement(key: string, value: number = 1): Promise<number> {
//     try {
//       return await this.client.decrby(key, value);
//     } catch (error) {
//       this.logger.error(`Error decrementing key ${key}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get all keys matching pattern
//    */
//   async keys(pattern: string): Promise<string[]> {
//     try {
//       return await this.client.keys(pattern);
//     } catch (error) {
//       this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
//       return [];
//     }
//   }

//   /**
//    * Delete all keys matching pattern
//    */
//   async deletePattern(pattern: string): Promise<number> {
//     try {
//       const keys = await this.keys(pattern);
//       if (keys.length === 0) return 0;
//       return await this.del(keys);
//     } catch (error) {
//       this.logger.error(`Error deleting pattern ${pattern}:`, error);
//       return 0;
//     }
//   }

//   /**
//    * Hash operations
//    */
//   async hSet(key: string, field: string, value: string): Promise<number> {
//     try {
//       return await this.client.hset(key, field, value);
//     } catch (error) {
//       this.logger.error(`Error setting hash field ${key}:${field}:`, error);
//       throw error;
//     }
//   }

//   async hGet(key: string, field: string): Promise<string | null> {
//     try {
//       return await this.client.hget(key, field);
//     } catch (error) {
//       this.logger.error(`Error getting hash field ${key}:${field}:`, error);
//       return null;
//     }
//   }

//   async hGetAll(key: string): Promise<Record<string, string>> {
//     try {
//       return await this.client.hgetall(key);
//     } catch (error) {
//       this.logger.error(`Error getting all hash fields ${key}:`, error);
//       return {};
//     }
//   }

//   async hDel(key: string, field: string | string[]): Promise<number> {
//     try {
//       const fields = Array.isArray(field) ? field : [field];
//       return await this.client.hdel(key, ...fields);
//     } catch (error) {
//       this.logger.error(`Error deleting hash field ${key}:`, error);
//       return 0;
//     }
//   }

//   /**
//    * List operations
//    */
//   async lPush(key: string, value: string | string[]): Promise<number> {
//     try {
//       const values = Array.isArray(value) ? value : [value];
//       return await this.client.lpush(key, ...values);
//     } catch (error) {
//       this.logger.error(`Error pushing to list ${key}:`, error);
//       throw error;
//     }
//   }

//   async rPush(key: string, value: string | string[]): Promise<number> {
//     try {
//       const values = Array.isArray(value) ? value : [value];
//       return await this.client.rpush(key, ...values);
//     } catch (error) {
//       this.logger.error(`Error pushing to list ${key}:`, error);
//       throw error;
//     }
//   }

//   async lRange(key: string, start: number, stop: number): Promise<string[]> {
//     try {
//       return await this.client.lrange(key, start, stop);
//     } catch (error) {
//       this.logger.error(`Error getting list range ${key}:`, error);
//       return [];
//     }
//   }

//   /**
//    * Set operations
//    */
//   async sAdd(key: string, member: string | string[]): Promise<number> {
//     try {
//       const members = Array.isArray(member) ? member : [member];
//       return await this.client.sadd(key, ...members);
//     } catch (error) {
//       this.logger.error(`Error adding to set ${key}:`, error);
//       throw error;
//     }
//   }

//   async sMembers(key: string): Promise<string[]> {
//     try {
//       return await this.client.smembers(key);
//     } catch (error) {
//       this.logger.error(`Error getting set members ${key}:`, error);
//       return [];
//     }
//   }

//   async sIsMember(key: string, member: string): Promise<boolean> {
//     try {
//       const result = await this.client.sismember(key, member);
//       return result === 1;
//     } catch (error) {
//       this.logger.error(`Error checking set member ${key}:`, error);
//       return false;
//     }
//   }

//   /**
//    * Flush database
//    */
//   async flushDb(): Promise<void> {
//     try {
//       await this.client.flushdb();
//       this.logger.log('Redis database flushed');
//     } catch (error) {
//       this.logger.error('Error flushing database:', error);
//       throw error;
//     }
//   }
// }
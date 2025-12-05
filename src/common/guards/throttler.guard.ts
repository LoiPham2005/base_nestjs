// ============================================
// src/common/guards/throttler.guard.ts
// ============================================
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address or user ID for tracking
    return Promise.resolve(req.user?.id || req.ip);
  }

  protected errorMessage = 'Too many requests. Please try again later.';
}
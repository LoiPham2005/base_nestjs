// ============================================
// src/common/constants/app.constant.ts
// ============================================
export const APP_CONSTANTS = {
  CORRELATION_ID_HEADER: 'x-correlation-id',
  REQUEST_ID_HEADER: 'x-request-id',
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  TOKEN_EXPIRY: 3600, // 1 hour in seconds
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days in seconds
  OTP_LENGTH: 6,
  OTP_EXPIRY: 300, // 5 minutes in seconds
} as const;

export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  REFRESH_TOKEN: (tokenId: string) => `refresh_token:${tokenId}`,
  OTP: (email: string) => `otp:${email}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate_limit:${ip}:${endpoint}`,
} as const;

export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  NOTIFICATION: 'notification-queue',
  FILE_PROCESSING: 'file-processing-queue',
  DATA_EXPORT: 'data-export-queue',
} as const;


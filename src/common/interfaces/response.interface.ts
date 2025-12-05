// ============================================
// src/common/interfaces/response.interface.ts
// ============================================
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: IErrorResponse;
  meta?: IMetadata;
  timestamp: string;
  path: string;
  statusCode: number;
}

export interface IErrorResponse {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface IMetadata {
  requestId?: string;
  version?: string;
  [key: string]: any;
}
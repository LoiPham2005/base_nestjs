// ============================================
// src/common/interfaces/jwt-payload.interface.ts
// ============================================
export interface IJwtPayload {
  sub: string; // user id
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface IRefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}
// ============================================
// src/common/interfaces/user.interface.ts
// ============================================
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRequest extends Request {
  user: IUser;
}
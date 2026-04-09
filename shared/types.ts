export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: UserRole;
  companyId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

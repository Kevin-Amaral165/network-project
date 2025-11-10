// types/user.ts
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: Date;
}

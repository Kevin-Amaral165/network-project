export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  invitationToken?: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

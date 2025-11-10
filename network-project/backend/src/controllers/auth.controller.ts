import { PrismaClient } from '@prisma/client';
import { AuthResponse } from '../types/auth';
import { UserResponse } from '../types/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const generateToken = (userId: number): string =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

const mapUser = (user: UserResponse): UserResponse => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const register = async (
  data: { username: string; email: string; password: string }
): Promise<AuthResponse> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user: UserResponse = await prisma.user.create({
    data: { username: data.username, email: data.email, password: hashedPassword },
  });

  return {
    user: mapUser(user),
    token: generateToken(user.id),
  };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  return {
    user: mapUser(user),
    token: generateToken(user.id),
  };
};

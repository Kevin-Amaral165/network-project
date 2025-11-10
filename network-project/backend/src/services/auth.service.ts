// Core
import { PrismaClient } from '../generated/prisma';

// Libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 🧩 Models
import { User } from '../models/user.model';


const prisma: PrismaClient = new PrismaClient();

/** JWT secret key */
const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret';

/** Generate JWT token for a user */
const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

/** Register a new user */
export const registerUser = async (
  user: User
): Promise<{ user: Omit<User, 'password'>; token: string }> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: user.username }, { email: user.email }],
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword: string = await bcrypt.hash(user.password!, 10);

  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  const token: string = generateToken(newUser.id, newUser.role);

  const { password, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token };
};

/** Login an existing user */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Omit<User, 'password'>; token: string }> => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token: string = generateToken(existingUser.id, existingUser.role);

  // Exclude password from returned user object
  const { password: _, ...userWithoutPassword } = existingUser;
  return { user: userWithoutPassword, token };
};

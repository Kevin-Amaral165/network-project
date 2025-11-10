import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

// Registro de usuário
export const registerUser = async (user: User): Promise<{ user: Omit<User, 'password'>; token: string }> => {
  // Verifica se já existe usuário com o mesmo username ou email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: user.username },
        { email: user.email },
      ],
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(user.password!, 10);

  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  // Gera o token JWT
  const token = jwt.sign(
    { id: newUser.id, role: newUser.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const { password, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token };
};

// Login de usuário
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Omit<User, 'password'>; token: string }> => {
  // Busca usuário pelo email
  const existingUser = await prisma.user.findUnique({
    where: { email }, // <-- apenas a string
  });

  if (!existingUser) {
    throw new Error('User not found');
  }

  // Verifica senha
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: existingUser.id, role: existingUser.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const { password: _, ...userWithoutPassword } = existingUser;
  return { user: userWithoutPassword, token };
};

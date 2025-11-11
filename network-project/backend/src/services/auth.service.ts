// src/services/auth.service.ts
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Gera token JWT
const generateToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "1h" });
};

// Cadastro de usuário
export const registerUser = async (
  user: User
): Promise<{ user: Omit<User, "password">; token: string }> => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username: user.username }, { email: user.email }] },
  });

  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(user.password!, 10);
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const token = generateToken(newUser.id, newUser.role);
  const { password, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token };
};

// Login de usuário existente
export const loginUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) throw new Error("Invalid password");

  const invitation = await prisma.invitation.findFirst({
    where: {
      usedByEmail: existingUser.email,
      used: false,
    },
  });

  const token = generateToken(existingUser.id, existingUser.role);
  const { password: _, ...userWithoutPassword } = existingUser;

  return {
    user: userWithoutPassword,
    token,
    invitationToken: invitation?.token || null,
  };
};

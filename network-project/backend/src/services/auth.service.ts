// Libraries
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma";

// Models
import { User } from "../models/user.model";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Generate JWT for user authentication
const generateToken = (id: number, role: string): string =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1h" });

// Find user by username or email
const findUserByCredentials = async (username: string, email: string): Promise<User | null> =>
  prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

// Hash user password
const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 10);

// Compare plain password with hashed one
const validatePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

// Register a new user
export const registerUser = async (
  user: User
): Promise<{ user: Omit<User, "password">; token: string }> => {
  const existingUser = await findUserByCredentials(user.username, user.email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword: string = await hashPassword(user.password!);

  const newUser: User = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const token: string = generateToken(newUser.id!, newUser.role as string);
  const { password, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

// Login an existing user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Omit<User, "password">; token: string; invitationToken: string | null }> => {
  const existingUser: User | null = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) throw new Error("User not found");

  const isPasswordValid = await validatePassword(password, existingUser.password!);
  if (!isPasswordValid) throw new Error("Invalid password");

  const invitation: { token: string } | null = await prisma.invitation.findFirst({
    where: { usedByEmail: existingUser.email, used: false },
  });

  const token: string = generateToken(existingUser.id!, existingUser.role as string);
  const { password: _, ...userWithoutPassword } = existingUser;

  return {
    user: userWithoutPassword,
    token,
    invitationToken: invitation?.token || null,
  };
};

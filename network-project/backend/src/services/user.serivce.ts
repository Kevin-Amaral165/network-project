// Libraries
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

// Types
import { UserRole } from "../types/user";

const prisma = new PrismaClient();

// Create a new user with hashed password
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<any> => {
  const hashedPassword: string = await bcryptjs.hash(data.password, 10);
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword, 
      role: data.role || "CUSTOMER",
    },
  });
};

// Get all users
export const getUsers = async (): Promise<any[]> => {
  return prisma.user.findMany();
};

// Find a user by email
export const findUserByEmail = async (email: string): Promise<any | null> => {
  return prisma.user.findUnique({ where: { email } });
};

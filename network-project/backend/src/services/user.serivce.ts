// Libraries
import { PrismaClient, Role } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Create a new user with hashed password */
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.CUSTOMER,
    },
  });
};

/** Get all users */
export const getUsers = async () => {
  return prisma.user.findMany();
};

/** Find a user by email */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

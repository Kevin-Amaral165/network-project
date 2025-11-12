// Libraries
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

// Services
import {
  createUser,
  getUsers,
  findUserByEmail,
} from "../../src/services/user.service";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const prisma: jest.Mocked<PrismaClient> = new PrismaClient() as unknown as jest.Mocked<PrismaClient>;

describe("user.service", (): void => {
  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user with hashed password", async (): Promise<void> => {
      const mockData: { username: string; email: string; password: string; role?: string } = {
        username: "kevin",
        email: "kevin@example.com",
        password: "123456",
      };
      const hashedPassword: string = "hashed123";
      const mockCreatedUser: { id: number; username: string; email: string; password: string; role: string } = {
        id: 1,
        username: "kevin",
        email: "kevin@example.com",
        password: hashedPassword,
        role: "CUSTOMER",
      };

      (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser as any);

      const result: { id: number; username: string; email: string; password: string; role: string } = await createUser(mockData as any);

      expect(bcryptjs.hash).toHaveBeenCalledWith("123456", 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "kevin",
          email: "kevin@example.com",
          password: hashedPassword,
          role: "CUSTOMER",
        },
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it("should create a user with a custom role when provided", async (): Promise<void> => {
      const mockData: { username: string; email: string; password: string; role?: string } = {
        username: "admin",
        email: "admin@example.com",
        password: "123456",
        role: "ADMIN",
      };
      const hashedPassword: string = "hashed456";
      const mockCreatedUser: { id: number; username: string; email: string; password: string; role: string } = {
        id: 2,
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      };

      (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser as any);

      const result: { id: number; username: string; email: string; password: string; role: string } = await createUser(mockData as any);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "admin",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe("getUsers", (): void => {
    it("should return all users", async (): Promise<void> => {
      const mockUsers: { id: number; username: string }[] = [
        { id: 1, username: "kevin" },
        { id: 2, username: "ana" },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsers as any);

      const result: { id: number; username: string }[] = await getUsers();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findUserByEmail", (): void => {
    it("should return the user corresponding to the email", async (): Promise<void> => {
      const mockUser: { id: number; username: string; email: string } = {
        id: 1,
        username: "kevin",
        email: "kevin@example.com",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser as any);

      const result: { id: number; username: string; email: string } | null = await findUserByEmail("kevin@example.com");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "kevin@example.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null if the user does not exist", async (): Promise<void> => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result: { id: number; username: string; email: string } | null = await findUserByEmail("notfound@example.com");

      expect(result).toBeNull();
    });
  });
});

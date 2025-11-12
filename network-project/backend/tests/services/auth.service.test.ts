// Libraries
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Services
import { registerUser, loginUser } from "../../src/services/auth.service";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("@prisma/client", () => {
  const mPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    invitation: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

const prisma: jest.Mocked<PrismaClient> = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("AuthService", (): void => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", (): void => {
    it("should register a new user and return a token", async (): Promise<void> => {
      const mockUser = {
        id: 1,
        username: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
        role: "CUSTOMER",
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (bcryptjs.hash as jest.Mock).mockResolvedValueOnce("hashed_password");
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({ ...mockUser, password: "hashed_password" });
      (jwt.sign as jest.Mock).mockReturnValueOnce("mocked_token");

      const result = await registerUser(mockUser as any);

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { OR: [{ username: mockUser.username }, { email: mockUser.email }] },
      });
      expect(bcryptjs.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id, role: mockUser.role }, expect.any(String), {
        expiresIn: "1h",
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        },
        token: "mocked_token",
      });
    });

    it("should throw an error if the user already exists", async (): Promise<void> => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce({ id: 1, username: "kevin" } as any);

      await expect(
        registerUser({
          username: "kevin",
          email: "kevin@test.com",
          password: "123",
          role: "CUSTOMER",
        } as any)
      ).rejects.toThrow("User already exists");

      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", (): void => {
    it("should log in an existing user and return token and invitationToken", async (): Promise<void> => {
      const mockUser = {
        id: 1,
        email: "kevin@test.com",
        username: "kevin",
        password: "hashed_password",
        role: "CUSTOMER",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser as any);
      (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);
      (prisma.invitation.findFirst as jest.Mock).mockResolvedValueOnce({ token: "invite123" });
      (jwt.sign as jest.Mock).mockReturnValueOnce("mocked_token");

      const result = await loginUser(mockUser.email, "123456");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcryptjs.compare).toHaveBeenCalledWith("123456", mockUser.password);
      expect(prisma.invitation.findFirst).toHaveBeenCalledWith({
        where: { usedByEmail: mockUser.email, used: false },
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role,
        },
        token: "mocked_token",
        invitationToken: "invite123",
      });
    });

    it("should throw an error if the user is not found", async (): Promise<void> => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(loginUser("inexistente@test.com", "123")).rejects.toThrow("User not found");

      expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    it("should throw an error if the password is invalid", async (): Promise<void> => {
      const mockUser = {
        id: 1,
        email: "kevin@test.com",
        password: "hashed_password",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser as any);
      (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(loginUser(mockUser.email, "senha_errada")).rejects.toThrow("Invalid password");

      expect(bcryptjs.compare).toHaveBeenCalled();
      expect(prisma.invitation.findFirst).not.toHaveBeenCalled();
    });
  });
});

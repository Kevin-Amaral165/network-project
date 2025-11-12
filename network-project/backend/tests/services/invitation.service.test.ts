// Libraries
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

// Services
import * as invitationService from "../../src/services/invitation.service";

jest.mock("@prisma/client", () => {
  const mPrisma = {
    invitation: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    user: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock("crypto", () => ({
  randomBytes: jest.fn(),
}));

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("InvitationService", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe("validateInvitationToken", (): void => {
    it("should return a valid invitation if token and email are correct", async (): Promise<void> => {
      const mockInvitation = {
        id: 1,
        token: "abc123",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        memberRequest: { email: "user@test.com" },
      };

      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(mockInvitation as any);

      const result = await invitationService.validateInvitationToken("abc123", "user@test.com");

      expect(result).toBe(mockInvitation);
      expect(prisma.invitation.findUnique).toHaveBeenCalledWith({
        where: { token: "abc123" },
        include: { memberRequest: true },
      });
    });

    it("should throw an error if the token does not exist", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        invitationService.validateInvitationToken("invalid", "user@test.com")
      ).rejects.toThrow("Token inválido");
    });

    it("should throw an error if the token is expired", async (): Promise<void> => {
      const expiredInvitation = {
        token: "abc123",
        expiresAt: new Date(Date.now() - 1000 * 60),
        memberRequest: { email: "user@test.com" },
      };
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(expiredInvitation as any);

      await expect(
        invitationService.validateInvitationToken("abc123", "user@test.com")
      ).rejects.toThrow("Token expirado");
    });

    it("should throw an error if the token does not belong to the email", async (): Promise<void> => {
      const mockInvitation = {
        token: "abc123",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        memberRequest: { email: "other@test.com" },
      };
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(mockInvitation as any);

      await expect(
        invitationService.validateInvitationToken("abc123", "user@test.com")
      ).rejects.toThrow("Token não pertence a este email");
    });
  });

  describe("registerWithInvitation", (): void => {
    it("should register user and update invitation", async (): Promise<void> => {
      const mockInvitation = {
        id: 1,
        token: "token123",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        memberRequest: { email: "user@test.com" },
      };

      const mockUser = {
        id: 10,
        username: "user",
        email: "user@test.com",
        password: "123",
        role: "CUSTOMER",
      };

      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(mockInvitation as any);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser as any);
      (prisma.invitation.update as jest.Mock).mockResolvedValueOnce({ ...mockInvitation, used: true } as any);


      const result: typeof mockUser = await invitationService.registerWithInvitation(
        "token123",
        "user@test.com",
        "user",
        "123"
      );

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "user",
          email: "user@test.com",
          password: "123",
          role: "CUSTOMER",
        },
      });

      expect(prisma.invitation.update).toHaveBeenCalledWith({
        where: { id: mockInvitation.id },
        data: { used: true, usedByEmail: "user@test.com" },
      });

      expect(result).toBe(mockUser);
    });

    it("should throw an error if the token is invalid", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        invitationService.registerWithInvitation("invalid", "user@test.com", "user", "123")
      ).rejects.toThrow("Token inválido");
    });
  });

  describe("createInvitation", () => {
    it("should create invitation and return token", async (): Promise<void> => {
      (randomBytes as jest.Mock).mockReturnValueOnce(Buffer.from("randomToken"));
      (prisma.invitation.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        token: "72616e646f6d546f6b656e",
        used: false,
        usedByEmail: "user@test.com",
      } as any);

      const result: { token: string } = await invitationService.createInvitation(1, "user@test.com");

      expect(randomBytes).toHaveBeenCalledWith(16);
      expect(prisma.invitation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          token: expect.any(String),
          used: false,
          usedByEmail: "user@test.com",
          memberRequest: { connect: { id: 1 } },
        }),
      });
      expect(result.token).toBeDefined();
    });
  });
});

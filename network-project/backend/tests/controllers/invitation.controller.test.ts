// Core
import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";

// Controllers
import {
  registerWithInvitationController,
  validateInvitation,
  validateInvitationTokenController,
} from "../../src/controllers/invitation.controller";

// Services
import * as invitationService from "../../src/services/invitation.service";

jest.mock("@prisma/client", () => {
  const mPrisma = {
    invitation: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock("../../src/services/invitation.service");

const app = express();
app.use(express.json());

app.post("/api/invitations/register/:token", registerWithInvitationController);
app.post("/api/invitations/validate", validateInvitation);
app.get("/api/invitations/validate/:token", validateInvitationTokenController);

const prisma = new PrismaClient();

describe("Invitation Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/invitations/register/:token", (): void => {
    it("Should register a user with a valid invitation", async (): Promise<void> => {
      const mockUser = { id: 1, email: "test@example.com", username: "Kevin" };

      (invitationService.registerWithInvitation as jest.Mock).mockResolvedValue(mockUser);

      const res: request.Response = await request(app)
        .post("/api/invitations/register/validtoken123")
        .send({
          email: "test@example.com",
          username: "Kevin",
          password: "123456",
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
      expect(res.body.message).toMatch(/successful/i);
      expect(invitationService.registerWithInvitation).toHaveBeenCalledWith(
        "validtoken123",
        "test@example.com",
        "Kevin",
        "123456"
      );
    });

    it("should return an error if the service throws an exception", async (): Promise<void> => {
      (invitationService.registerWithInvitation as jest.Mock).mockRejectedValue(
        new Error("Convite inválido")
      );

      const res: request.Response = await request(app)
        .post("/api/invitations/register/invalidtoken")
        .send({
          email: "fail@example.com",
          username: "Fail",
          password: "123456",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Convite inválido");
    });
  });

  describe("POST /api/invitations/validate", () => {
    it("should validate an invitation correctly", async (): Promise<void> => {
      (prisma.invitation.findFirst as jest.Mock).mockResolvedValue({
        token: "abc123",
        usedByEmail: "test@example.com",
        used: false,
        expiresAt: new Date(Date.now() + 100000),
      });

      const res: request.Response = await request(app)
        .post("/api/invitations/validate")
        .send({
          token: "abc123",
          email: "test@example.com",
        });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(prisma.invitation.findFirst).toHaveBeenCalled();
    });

    it("should return invalid if the invitation does not exist", async (): Promise<void> => {
      (prisma.invitation.findFirst as jest.Mock).mockResolvedValue(null);

      const res: request.Response = await request(app)
        .post("/api/invitations/validate")
        .send({
          token: "xyz999",
          email: "notfound@example.com",
        });

      expect(res.status).toBe(400);
      expect(res.body.valid).toBe(false);
    });
  });

  describe("GET /api/invitations/validate/:token", (): void => {
    it("should validate token and return valid invitation", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValue({
        token: "abc123",
        expiresAt: new Date(Date.now() + 100000),
      });

      const res: request.Response = await request(app).get("/api/invitations/validate/abc123");

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.invitation).toHaveProperty("token");
    });

    it("should return error if invitation is not found", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValue(null);

      const res: request.Response = await request(app).get("/api/invitations/validate/invalid");

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/não encontrado/i);
    });

    it("should return error if invitation is expired", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockResolvedValue({
        token: "expired",
        expiresAt: new Date(Date.now() - 100000),
      });

      const res: request.Response = await request(app).get("/api/invitations/validate/expired");

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/expirado/i);
    });

    it("should return generic error if Prisma throws exception", async (): Promise<void> => {
      (prisma.invitation.findUnique as jest.Mock).mockRejectedValue(
        new Error("Unexpected error")
      );

      const res: request.Response = await request(app).get("/api/invitations/validate/error");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Unexpected error");
    });
  });
});

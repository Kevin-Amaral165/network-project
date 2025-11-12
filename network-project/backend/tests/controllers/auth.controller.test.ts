// Core
import request from "supertest";
import express from "express";

// Controllers
import { register, login } from "../../src/controllers/auth.controller";

// Services
import * as authService from "../../src/services/auth.service";

const app = express();
app.use(express.json());
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

jest.mock("../../src/services/auth.service");

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", (): void => {
    it("should register a user successfully", async (): Promise<void> => {
      const mockUser = {
        id: 1,
        username: "Kevin",
        email: "kevin@example.com",
      };
      const mockToken: string = "mocked.jwt.token";

      (authService.registerUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const res: request.Response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "Kevin",
          email: "kevin@example.com",
          password: "123456",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user");
      expect(res.body).toHaveProperty("token");
      expect(authService.registerUser).toHaveBeenCalledWith({
        username: "Kevin",
        email: "kevin@example.com",
        password: "123456",
      });
    });

    it("should return an error if required fields are missing", async (): Promise<void> => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "kevin@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async (): Promise<void> => {
      const mockUser = {
        id: 1,
        username: "Kevin",
        email: "kevin@example.com",
      };
      const mockToken: string = "mocked.jwt.token";
      const mockInvitationToken: string = "mocked.invitation.token";

      (authService.loginUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
        invitationToken: mockInvitationToken,
      });

      const res: request.Response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "kevin@example.com",
          password: "123456",
        });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("kevin@example.com");
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("invitationToken");
      expect(authService.loginUser).toHaveBeenCalledWith(
        "kevin@example.com",
        "123456"
      );
    });

    it("should return an error if required fields are missing", async (): Promise<void> => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });
  });
});

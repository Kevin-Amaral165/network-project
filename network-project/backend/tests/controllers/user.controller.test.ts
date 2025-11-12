// Core
import request from "supertest";
import express from "express";

// Controllers
import { getUsers, createUser } from "../../src/controllers/user.controller";

// Services
import * as userService from "../../src/services/user.service";

jest.mock("../../src/services/user.service");

const app = express();
app.use(express.json());

app.get("/api/users", getUsers);
app.post("/api/users", createUser);

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users", (): void => {
    it("should return all users", async (): Promise<void> => {
      const mockUsers: Array<{ id: number; username: string; email: string; role: string }> = [
        { id: 1, username: "admin", email: "admin@example.com", role: "ADMIN" },
        { id: 2, username: "user", email: "user@example.com", role: "CUSTOMER" },
      ];

      (userService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const res: request.Response = await request(app).get("/api/users");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(userService.getUsers).toHaveBeenCalled();
    });

    it("should return 500 if the service throws an error", async (): Promise<void> => {
      (userService.getUsers as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res: request.Response = await request(app).get("/api/users");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("DB error");
    });
  });

  describe("POST /api/users", (): void => {
    it("should create a new user successfully", async (): Promise<void> => {
      const mockInput: { username: string; email: string; password: string; role: string } = {
        username: "newuser",
        email: "new@example.com",
        password: "123456",
        role: "CUSTOMER",
      };

      const mockUser: { id: number; username: string; email: string; password: string; role: string } = { id: 3, ...mockInput };
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const res: request.Response = await request(app).post("/api/users").send(mockInput);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith(mockInput);
    });

    it("should return 500 if the service throws an error", async (): Promise<void> => {
      (userService.createUser as jest.Mock).mockRejectedValue(new Error("Failed to create user"));

      const res: request.Response = await request(app)
        .post("/api/users")
        .send({ username: "error", email: "fail@example.com", password: "123" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to create user");
    });
  });
});

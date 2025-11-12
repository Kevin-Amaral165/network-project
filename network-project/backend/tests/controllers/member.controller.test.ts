// Core
import request from "supertest";
import express from "express";

// Controllers
import {
  createMemberRequest,
  getAllMemberRequests,
  updateMemberRequestStatus,
} from "../../src/controllers/member.controller";

// Services
import * as memberService from "../../src/services/member.service";

jest.mock("../../src/services/member.service");

const app = express();
app.use(express.json());

app.post("/api/member-requests", createMemberRequest);
app.get("/api/member-requests", getAllMemberRequests);
app.put("/api/member-requests/:id", updateMemberRequestStatus);

describe("Member Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/member-requests", (): void => {
    it("should create a member request successfully", async (): Promise<void> => {
      const mockBody = { userId: 1, restaurantId: 10, status: "PENDING" };
      (memberService.createMemberRequest as jest.Mock).mockResolvedValue(mockBody);

      const res: request.Response = await request(app).post("/api/member-requests").send(mockBody);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockBody);
      expect(memberService.createMemberRequest).toHaveBeenCalledWith(mockBody);
    });

    it("should return 409 if the request already exists", async (): Promise<void> => {
      (memberService.createMemberRequest as jest.Mock).mockRejectedValue(
        new Error("Usuário já enviou uma solicitação")
      );

      const res: request.Response = await request(app)
        .post("/api/member-requests")
        .send({ userId: 1, restaurantId: 10 });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/já enviou/i);
    });

    it("should return 500 for other errors", async (): Promise<void> => {
      (memberService.createMemberRequest as jest.Mock).mockRejectedValue(
        new Error("Erro inesperado")
      );

      const res: request.Response = await request(app)
        .post("/api/member-requests")
        .send({ userId: 1, restaurantId: 10 });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/error creating/i);
    });
  });

  describe("GET /api/member-requests", () => {
    it("should return all member requests", async (): Promise<void> => {
      const mockRequests = [
        { id: 1, userId: 1, restaurantId: 10, status: "PENDING" },
        { id: 2, userId: 2, restaurantId: 11, status: "APPROVED" },
      ];
      (memberService.getAllMemberRequests as jest.Mock).mockResolvedValue(mockRequests);

      const res: request.Response = await request(app).get("/api/member-requests");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].status).toBe("PENDING");
      expect(memberService.getAllMemberRequests).toHaveBeenCalled();
    });

    it("should return 500 for service errors", async (): Promise<void> => {
      (memberService.getAllMemberRequests as jest.Mock).mockRejectedValue(new Error("DB error"));

      const res: request.Response = await request(app).get("/api/member-requests");

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/error getting/i);
    });
  });

  describe("PUT /api/member-requests/:id", () => {
    it("should update the request status successfully", async (): Promise<void> => {
      const mockResult: { id: number; status: string; invitationToken: string } = { id: 1, status: "APPROVED", invitationToken: "token123" };
      (memberService.updateMemberRequestStatus as jest.Mock).mockResolvedValue(mockResult);

      const res: request.Response = await request(app)
        .put("/api/member-requests/1")
        .send({ status: "APPROVED" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("APPROVED");
      expect(res.body.invitationToken).toBe("token123");
      expect(memberService.updateMemberRequestStatus).toHaveBeenCalledWith(1, "APPROVED");
    });
  });
});

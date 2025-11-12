// Libraries
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

// Servuces
import {
  createMemberRequest,
  getAllMemberRequests,
  updateMemberRequestStatus,
} from "../../src/services/member.service";

// Types
import { MemberRequestStatus } from "../../src/types/member";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    memberRequest: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    invitation: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const prisma: jest.Mocked<PrismaClient> = new PrismaClient() as unknown as jest.Mocked<PrismaClient>;

describe("member.service", (): void => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createMemberRequest", (): void => {
    it("should create a new member request when none is pending", async (): Promise<void> => {
      const mockData: {
        id: number;
        email: string;
        status: MemberRequestStatus;
      } = { id: 1, email: "test@example.com", status: MemberRequestStatus.PENDING };

      (prisma.memberRequest.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.memberRequest.create as jest.Mock).mockResolvedValueOnce(mockData as any);


      const result = await createMemberRequest(mockData as any);

      expect(prisma.memberRequest.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com", status: MemberRequestStatus.PENDING },
      });
      expect(prisma.memberRequest.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockData);
    });
  });

  describe("getAllMemberRequests", () => {
    it("should return all member requests", async (): Promise<void> => {
      const mockRequests = [
        { id: 1, email: "a@test.com" },
        { id: 2, email: "b@test.com" },
      ];

      (prisma.memberRequest.findMany as jest.Mock).mockResolvedValueOnce(mockRequests as any);

      const result = await getAllMemberRequests();

      expect(prisma.memberRequest.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockRequests);
    });
  });

  describe("updateMemberRequestStatus", (): void => {
    it("should update the request status and generate a token if approved", async (): Promise<void> => {
      const mockUpdated: { id: number; email: string; status: string } = { id: 1, email: "test@example.com", status: "APPROVED" };
      const mockToken: string = "fakeToken";
      const mockInvitation: { token: string } = { token: mockToken };

      (prisma.memberRequest.update as jest.Mock).mockResolvedValueOnce(mockUpdated as any);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      (prisma.invitation.create as jest.Mock).mockResolvedValueOnce(mockInvitation as any);


      const result = await updateMemberRequestStatus(1, "APPROVED");

      expect(prisma.memberRequest.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: "APPROVED" },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: mockUpdated.email, id: mockUpdated.id },
        expect.any(String),
        { expiresIn: "7d" }
      );
      expect(prisma.invitation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          token: mockToken,
          memberRequestId: 1,
        }),
      });
      expect(result).toEqual({ ...mockUpdated, invitationToken: mockToken });
    });
  });
});

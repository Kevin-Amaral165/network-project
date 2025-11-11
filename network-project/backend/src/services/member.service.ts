// Libraries
import { Invitation, PrismaClient } from "../generated/prisma";
import jwt from "jsonwebtoken";


// Types
import { CreateMemberRequestBody, MemberRequestStatus } from "../types/member";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Create a new member request
export const createMemberRequest = async (data: CreateMemberRequestBody): Promise<CreateMemberRequestBody> => {
  const existingRequest: CreateMemberRequestBody | null = await prisma.memberRequest.findFirst({
    where: {
      email: data.email,
      status: MemberRequestStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new Error("Você já enviou uma solicitação pendente.");
  }

  return await prisma.memberRequest.create({ data });
};

// Get all member requests
export const getAllMemberRequests = async (): Promise<CreateMemberRequestBody[]> => {
  return await prisma.memberRequest.findMany();
};

// Update the status of a member request
export const updateMemberRequestStatus = async (id: number, status: string): Promise<CreateMemberRequestBody | (
  CreateMemberRequestBody & { invitationToken: string }
)> => {
  const updated = await prisma.memberRequest.update({
    where: { id },
    data: { status: status as MemberRequestStatus },
  });

  if (status === "APPROVED") {
    const token = jwt.sign(
      { email: updated.email, id: updated.id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const invitation: Invitation = await prisma.invitation.create({
      data: {
        token,
        memberRequestId: updated.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    console.log("Token gerado no backend:", token);

    return { ...updated, invitationToken: invitation.token };
  }

  return updated;
};
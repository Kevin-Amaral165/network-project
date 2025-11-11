// Libraries
import { PrismaClient } from "../generated/prisma";

// Types
import { CreateMemberRequestBody, MemberRequestStatus } from "../types/member";

const prisma = new PrismaClient();

/** Create a new member request */
export const createMemberRequest = async (data: CreateMemberRequestBody): Promise<CreateMemberRequestBody> => {
  const existingRequest = await prisma.memberRequest.findFirst({
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

/** Get all member requests */
export const getAllMemberRequests = async (): Promise<CreateMemberRequestBody[]> => {
  return await prisma.memberRequest.findMany();
};

/** Update the status of a member request */
export const updateMemberRequestStatus = async (
  id: number,
  status: MemberRequestStatus
): Promise<CreateMemberRequestBody> => {
  return await prisma.memberRequest.update({
    where: { id },
    data: { status },
  });
};
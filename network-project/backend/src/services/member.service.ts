// services/member.service.ts
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const createMemberRequest = async (data: {
  name: string;
  email: string;
  company: string;
  reason: string;
}) => {
  // 🔒 Verifica se já existe uma solicitação com o mesmo e-mail pendente
  const existingRequest = await prisma.memberRequest.findFirst({
    where: {
      email: data.email,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw new Error("Você já enviou uma solicitação pendente.");
  }

  return await prisma.memberRequest.create({ data });
};

export const getAllMemberRequests = async () => {
  return await prisma.memberRequest.findMany();
};

export const updateMemberRequestStatus = async (
  id: number,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  return await prisma.memberRequest.update({
    where: { id },
    data: { status },
  });
};

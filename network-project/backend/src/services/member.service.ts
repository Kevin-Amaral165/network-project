// Libraries
import { randomBytes } from "crypto";
import { PrismaClient } from "../generated/prisma";

// Types
import { CreateMemberRequestBody, MemberRequestStatus } from "../types/member";

const prisma = new PrismaClient();

/**
 * Create a new member request.
 * - Checks if there is already a pending request for the same email.
 * - Saves the new request in the database.
 */
export const createMemberRequest = async (
  data: CreateMemberRequestBody
) => {
  const existingRequest = await prisma.memberRequest.findFirst({
    where: {
      email: data.email,
      status: MemberRequestStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new Error("You have already sent a pending request.");
  }

  // Prisma automatically fills status (PENDING) and createdAt (now)
  return await prisma.memberRequest.create({ data });
};

/**
 * Get all member requests.
 */
export const getAllMemberRequests = async () => {
  return await prisma.memberRequest.findMany({
    include: {
      invitation: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Update the status of a member request.
 * - If approved, automatically generates an invitation token.
 */
export const updateMemberRequestStatus = async (
  id: number,
  status: MemberRequestStatus
) => {
  const updatedRequest = await prisma.memberRequest.update({
    where: { id },
    data: { status },
  });

  // Generate an invitation when the request is approved
  if (status === MemberRequestStatus.APPROVED) {
    const token = randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.invitation.create({
      data: {
        token,
        expiresAt,
        memberRequestId: id,
      },
    });

    console.log(`Invitation link: http://localhost:3000/invite/${token}`);
  }

  return updatedRequest;
};

/**
 * Get all member requests with full debug
 */
export const getAllMemberRequestsDebug = async () => {
  try {
    // Busca todos os MemberRequests, incluindo invitation
    const memberRequests = await prisma.memberRequest.findMany({
      include: { invitation: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("==== DEBUG: MemberRequests ====");
    console.log("Total MemberRequests:", memberRequests.length);

    memberRequests.forEach((req, index) => {
      console.log(`--- MemberRequest #${index + 1} ---`);
      console.log("ID:", req.id);
      console.log("Name:", req.name);
      console.log("Email:", req.email);
      console.log("Company:", req.company);
      console.log("Reason:", req.reason);
      console.log("Status:", req.status);
      console.log("CreatedAt:", req.createdAt);
      console.log("Invitation:", req.invitation);
    });

    console.log("==== END DEBUG ====");
    return memberRequests;
  } catch (error) {
    console.error("Error fetching member requests:", error);
    throw error;
  }
};

// Libraries
import { PrismaClient, Invitation, User } from "../generated/prisma";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Validate an invitation token for a given email
export const validateInvitationToken = async (token: string, email: string): Promise<Invitation> => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { memberRequest: true },
  });

  if (!invitation) throw new Error("Token inválido");
  if (invitation.expiresAt < new Date()) throw new Error("Token expirado");

  if (invitation.memberRequest.email !== email) {
    throw new Error("Token não pertence a este email");
  }

  return invitation;
};

/** Register a user and mark invitation as used */
export const registerWithInvitation = async (token: string, email: string, username: string, password: string): Promise<User> => {
  const invitation: Invitation = await validateInvitationToken(token, email);

  const user: User = await prisma.user.create({
    data: {
      username,
      email,
      password,
      role: "CUSTOMER",
    },
  });

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { used: true, usedByEmail: email },
  });

  return user;
};

export const createInvitation = async (memberRequestId: number, email: string): Promise<Invitation> => {
  const token: string = randomBytes(16).toString("hex");

  const invitation: Invitation = await prisma.invitation.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      used: false,
      usedByEmail: email,
      memberRequest: {
        connect: { id: memberRequestId },
      },
    },
  });

  console.log("Token gerado para:", email, "→", token);

  return invitation;
};
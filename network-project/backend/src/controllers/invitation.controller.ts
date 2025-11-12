// Core
import { Request, Response } from "express";

// Libraries
import { PrismaClient } from "@prisma/client";

// Services
import * as invitationService from "../services/invitation.service";

const prisma: any = new PrismaClient();

// Handle user registration using a valid invitation token
export const registerWithInvitationController = async (
  req: Request<{ token: string }>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { email, username, password } = req.body;

    const user = await invitationService.registerWithInvitation(token, email, username, password);

    res.status(201).json({ message: "Registration successful", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Validate invitation by token and email before completing registration
export const validateInvitation = async (req: Request, res: Response): Promise<Response> => {
  const { token, email } = req.body;

  const invitation = await prisma.invitation.findFirst({
    where: {
      token,
      usedByEmail: email,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!invitation) {
    return res.status(400).json({ valid: false });
  }

  console.log(`Token validado com sucesso para ${email}`);
  return res.json({ valid: true });
};

// Validate invitation token by token param (used when opening invitation link)
export const validateInvitationTokenController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      res.status(404).json({ message: "Convite não encontrado" });
      return;
    }

    if (invitation.expiresAt < new Date()) {
      res.status(400).json({ message: "Convite expirado" });
      return;
    }

    res.status(200).json({ valid: true, invitation });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
import { Request, Response } from "express";
import * as invitationService from "../services/invitation.service";

export const validateInvitationTokenController = async (
  req: Request<{ token: string }>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { email } = req.body; // email do usuário tentando registrar
    const invitation = await invitationService.validateInvitationToken(token, email);
    res.status(200).json(invitation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

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

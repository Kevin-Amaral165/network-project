// Core
import { Request, Response } from "express";

// Services
import * as memberService from "../services/member.service";

// Types
import { CreateMemberRequestBody, UpdateMemberRequestStatusBody } from "../types/member";

/** Create a new member request */
export const createMemberRequest = async (
  req: Request<{}, {}, CreateMemberRequestBody>,
  res: Response
): Promise<Response | void> => {
  try {
    const memberRequest: CreateMemberRequestBody = await memberService.createMemberRequest(req.body);
    res.status(201).json(memberRequest);
  } catch (error: any) {
    if (error.message.includes("já enviou uma solicitação")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Error creating member request" });
  }
};

/** Get all member requests */
export const getAllMemberRequests = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const memberRequests: CreateMemberRequestBody[] = await memberService.getAllMemberRequests();
    res.status(200).json(memberRequests);
  } catch (error) {
    res.status(500).json({ message: "Error getting member requests" });
  }
};

/** Update the status of a member request*/
export const updateMemberRequestStatus = async (
  req: Request<{ id: string }, {}, UpdateMemberRequestStatusBody>,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await memberService.updateMemberRequestStatus(Number(id), status);

    console.log("Token retornado ao front:", (result as any).invitationToken);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating member request" });
  }
};

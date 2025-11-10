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
) => {
  try {
    const memberRequest = await memberService.createMemberRequest(req.body);
    res.status(201).json(memberRequest);
  } catch (error: any) {
    if (error.message.includes("já enviou uma solicitação")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Error creating member request" });
  }
};

/** Get all member requests */
export const getAllMemberRequests = async (_req: Request, res: Response) => {
  try {
    const memberRequests = await memberService.getAllMemberRequests();
    res.status(200).json(memberRequests);
  } catch (error) {
    res.status(500).json({ message: "Error getting member requests" });
  }
};

/** Update the status of a member request*/
export const updateMemberRequestStatus = async (
  req: Request<{ id: string }, {}, UpdateMemberRequestStatusBody>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const memberRequest = await memberService.updateMemberRequestStatus(
      Number(id),
      status
    );

    res.status(200).json(memberRequest);
  } catch (error) {
    res.status(500).json({ message: "Error updating member request" });
  }
};

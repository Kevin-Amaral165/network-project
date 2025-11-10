import { Request, Response } from "express";
import * as memberService from "../services/member.service";

// controllers/member.controller.ts
export const createMemberRequest = async (req: Request, res: Response) => {
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

export const getAllMemberRequests = async (req: Request, res: Response) => {
  try {
    const memberRequests = await memberService.getAllMemberRequests();
    res.status(200).json(memberRequests);
  } catch (error) {
    res.status(500).json({ message: "Error getting member requests" });
  }
};

export const updateMemberRequestStatus = async (
  req: Request,
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

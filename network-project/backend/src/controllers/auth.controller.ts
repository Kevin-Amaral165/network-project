// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { User } from "../models/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Username, email, and password are required" });

    const { user, token } = await registerUser({ username, email, password });
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const { user, token, invitationToken } = await loginUser(email, password);
    res.status(200).json({ user, token, invitationToken });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

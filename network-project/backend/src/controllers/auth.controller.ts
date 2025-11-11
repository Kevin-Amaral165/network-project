// Core
import { Request, Response } from "express";

// Services
import { registerUser, loginUser } from "../services/auth.service";

// Registration a new user
export const register = async (req: Request, res: Response): Promise<Response | void> => {
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

// Login an existing user
export const login = async (req: Request, res: Response): Promise<Response | void> => {
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

// Core
import { Request, Response } from 'express';

// Services
import { registerUser, loginUser } from '../services/auth.service';

// Models
import { User } from '../models/user.model';


/** Handles user registration */
export const register = async (req: Request<{}, {}, Partial<User>>, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Call service to create user and generate token
    const { user, token } = await registerUser({ username, email, password });

    // Return created user and JWT
    return res.status(201).json({ user, token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
};

/** Handles user login */
export const login = async (req: Request<{}, {}, { email?: string; password?: string }>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Call service to authenticate user and generate token
    const { user, token } = await loginUser(email, password);

    // Return authenticated user and JWT
    return res.status(200).json({ user, token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
};

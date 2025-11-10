// Core
import { Request, Response } from "express";

// Services
import * as userService from "../services/user.serivce";

// Types
import { CreateUserInput, User } from "../types/user";

// Define response types
type GetUsersResponse = User[] | { error: string };
type CreateUserResponse = User | { error: string };

/** Get all users. */
export const getUsers = async (req: Request, res: Response<GetUsersResponse>) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error fetching users" });
    }
  }
};

/** Create a new user. */
export const createUser = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response<CreateUserResponse>
) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await userService.createUser({ username, email, password, role });
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error creating user" });
    }
  }
};

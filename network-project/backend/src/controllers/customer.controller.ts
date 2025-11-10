import { Request, Response } from "express";
export const getCustomers = (req: Request, res: Response) => res.json({ message: "Get all customers" });

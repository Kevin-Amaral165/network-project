import { Request, Response } from "express";
export const getOrders = (req: Request, res: Response) => res.json({ message: "Get all orders" });

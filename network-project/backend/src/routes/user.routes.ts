import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";
import { protect, verifyAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", protect, verifyAdmin, getUsers);
router.post("/", protect, verifyAdmin, createUser);

export default router;

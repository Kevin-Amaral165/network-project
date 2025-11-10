// Core
import { Router } from "express";

// Controllers
import { getUsers, createUser } from "../controllers/user.controller";

// Middleware
import { protect, verifyAdmin } from "../middleware/auth.middleware";

const router: Router = Router();

// Routes
router.get("/", protect, verifyAdmin, getUsers);
router.post("/", protect, verifyAdmin, createUser);

export default router;

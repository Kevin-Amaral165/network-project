// Core
import { Router } from "express";

// Controllers
import {
  createMemberRequest,
  getAllMemberRequests,
  updateMemberRequestStatus,
} from "../controllers/member.controller";

// Middleware
import { protect, verifyAdmin } from "../middleware/auth.middleware";

const router: Router = Router();

// Routes
router.post("/", createMemberRequest);
router.get("/", protect, verifyAdmin, getAllMemberRequests);
router.put("/:id", protect, verifyAdmin, updateMemberRequestStatus);

export default router;

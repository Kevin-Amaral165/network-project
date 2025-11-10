import { Router } from "express";
import { protect, verifyAdmin } from "../middleware/auth.middleware";
import {
  createMemberRequest,
  getAllMemberRequests,
  updateMemberRequestStatus,
} from "../controllers/member.controller";

const router = Router();

console.log("protect:", typeof protect);
console.log("verifyAdmin:", typeof verifyAdmin);
console.log("getAllMemberRequests:", typeof getAllMemberRequests);


router.post("/", createMemberRequest);
router.get("/", protect, verifyAdmin, getAllMemberRequests);
router.put("/:id", protect, verifyAdmin, updateMemberRequestStatus);

export default router;

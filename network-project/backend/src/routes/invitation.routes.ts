// Core
import { Router } from "express";

// Controllers
import { validateInvitationTokenController } from "../controllers/invitation.controller";

const router: Router = Router();

// Routes
router.post("/validate/:token", validateInvitationTokenController);

export default router;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Core
const express_1 = require("express");
// Controllers
const invitation_controller_1 = require("../controllers/invitation.controller");
const router = (0, express_1.Router)();
// Routes
router.get("/validate/:token", invitation_controller_1.validateInvitationTokenController);
exports.default = router;

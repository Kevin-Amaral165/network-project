"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Core
const express_1 = require("express");
// Controllers
const member_controller_1 = require("../controllers/member.controller");
// Middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Routes
router.post("/", member_controller_1.createMemberRequest);
router.get("/", auth_middleware_1.protect, auth_middleware_1.verifyAdmin, member_controller_1.getAllMemberRequests);
router.put("/:id", auth_middleware_1.protect, auth_middleware_1.verifyAdmin, member_controller_1.updateMemberRequestStatus);
exports.default = router;

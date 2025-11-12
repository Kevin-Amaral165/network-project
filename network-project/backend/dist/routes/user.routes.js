"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Core
const express_1 = require("express");
// Controllers
const user_controller_1 = require("../controllers/user.controller");
// Middleware
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Routes
router.get("/", auth_middleware_1.protect, auth_middleware_1.verifyAdmin, user_controller_1.getUsers);
router.post("/", auth_middleware_1.protect, auth_middleware_1.verifyAdmin, user_controller_1.createUser);
exports.default = router;

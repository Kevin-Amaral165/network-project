"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Core
const express_1 = require("express");
// Controllers
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
exports.default = router;

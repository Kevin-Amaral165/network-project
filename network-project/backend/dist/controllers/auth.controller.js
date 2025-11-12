"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
// Services
const auth_service_1 = require("../services/auth.service");
// Registration a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: "Username, email, and password are required" });
        const { user, token } = yield (0, auth_service_1.registerUser)({ username, email, password });
        res.status(201).json({ user, token });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.register = register;
// Login an existing user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });
        const { user, token, invitationToken } = yield (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({ user, token, invitationToken });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.login = login;

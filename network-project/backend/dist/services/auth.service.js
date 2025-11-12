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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
// Libraries
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// Generate JWT for user authentication
const generateToken = (id, role) => jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: "1h" });
// Find user by username or email
const findUserByCredentials = (username, email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
    });
});
// Hash user password
const hashPassword = (password) => bcryptjs_1.default.hash(password, 10);
// Compare plain password with hashed one
const validatePassword = (plain, hash) => bcryptjs_1.default.compare(plain, hash);
// Register a new user
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield findUserByCredentials(user.username, user.email);
    if (existingUser)
        throw new Error("User already exists");
    const hashedPassword = yield hashPassword(user.password);
    const newUser = yield prisma.user.create({
        data: {
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: "CUSTOMER",
        },
    });
    const token = generateToken(newUser.id, newUser.role);
    const { password } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
    return { user: userWithoutPassword, token };
});
exports.registerUser = registerUser;
// Login an existing user
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (!existingUser)
        throw new Error("User not found");
    const isPasswordValid = yield validatePassword(password, existingUser.password);
    if (!isPasswordValid)
        throw new Error("Invalid password");
    const invitation = yield prisma.invitation.findFirst({
        where: { usedByEmail: existingUser.email, used: false },
    });
    const token = generateToken(existingUser.id, existingUser.role);
    const { password: _ } = existingUser, userWithoutPassword = __rest(existingUser, ["password"]);
    return {
        user: userWithoutPassword,
        token,
        invitationToken: (invitation === null || invitation === void 0 ? void 0 : invitation.token) || null,
    };
});
exports.loginUser = loginUser;

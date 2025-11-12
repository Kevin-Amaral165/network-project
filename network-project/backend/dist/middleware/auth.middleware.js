"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.protect = void 0;
// Libraries
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/** Protect routes by validating JWT token */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    return res.status(401).json({ error: 'Not authorized, no token' });
};
exports.protect = protect;
/** Middleware to check if the authenticated user is an admin */
const verifyAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN') {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized as an admin' });
};
exports.verifyAdmin = verifyAdmin;

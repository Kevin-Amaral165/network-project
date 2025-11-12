"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.validateInvitationTokenController = exports.validateInvitation = exports.registerWithInvitationController = void 0;
// Libraries
const client_1 = require("@prisma/client");
// Services
const invitationService = __importStar(require("../services/invitation.service"));
const prisma = new client_1.PrismaClient();
// Handle user registration using a valid invitation token
const registerWithInvitationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { email, username, password } = req.body;
        const user = yield invitationService.registerWithInvitation(token, email, username, password);
        res.status(201).json({ message: "Registration successful", user });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.registerWithInvitationController = registerWithInvitationController;
// Validate invitation by token and email before completing registration
const validateInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    const invitation = yield prisma.invitation.findFirst({
        where: {
            token,
            usedByEmail: email,
            used: false,
            expiresAt: { gt: new Date() },
        },
    });
    if (!invitation) {
        return res.status(400).json({ valid: false });
    }
    console.log(`Token validado com sucesso para ${email}`);
    return res.json({ valid: true });
});
exports.validateInvitation = validateInvitation;
// Validate invitation token by token param (used when opening invitation link)
const validateInvitationTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const invitation = yield prisma.invitation.findUnique({
            where: { token },
        });
        if (!invitation) {
            res.status(404).json({ message: "Convite não encontrado" });
            return;
        }
        if (invitation.expiresAt < new Date()) {
            res.status(400).json({ message: "Convite expirado" });
            return;
        }
        res.status(200).json({ valid: true, invitation });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.validateInvitationTokenController = validateInvitationTokenController;

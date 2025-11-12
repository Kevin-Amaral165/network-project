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
exports.createInvitation = exports.registerWithInvitation = exports.validateInvitationToken = void 0;
// Libraries
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma = new client_1.PrismaClient();
// Validate an invitation token for a given email
const validateInvitationToken = (token, email) => __awaiter(void 0, void 0, void 0, function* () {
    const invitation = yield prisma.invitation.findUnique({
        where: { token },
        include: { memberRequest: true },
    });
    if (!invitation)
        throw new Error("Token inválido");
    if (invitation.expiresAt < new Date())
        throw new Error("Token expirado");
    if (invitation.memberRequest.email !== email) {
        throw new Error("Token não pertence a este email");
    }
    return invitation;
});
exports.validateInvitationToken = validateInvitationToken;
/** Register a user and mark invitation as used */
const registerWithInvitation = (token, email, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const invitation = yield (0, exports.validateInvitationToken)(token, email);
    const user = yield prisma.user.create({
        data: {
            username,
            email,
            password,
            role: "CUSTOMER",
        },
    });
    yield prisma.invitation.update({
        where: { id: invitation.id },
        data: { used: true, usedByEmail: email },
    });
    return user;
});
exports.registerWithInvitation = registerWithInvitation;
const createInvitation = (memberRequestId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, crypto_1.randomBytes)(16).toString("hex");
    const invitation = yield prisma.invitation.create({
        data: {
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            used: false,
            usedByEmail: email,
            memberRequest: {
                connect: { id: memberRequestId },
            },
        },
    });
    console.log("Token gerado para:", email, "→", token);
    return invitation;
});
exports.createInvitation = createInvitation;

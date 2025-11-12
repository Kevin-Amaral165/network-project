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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberRequestStatus = exports.getAllMemberRequests = exports.createMemberRequest = void 0;
// Libraries
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Types
const member_1 = require("../types/member");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// Create a new member request
const createMemberRequest = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRequest = yield prisma.memberRequest.findFirst({
        where: {
            email: data.email,
            status: member_1.MemberRequestStatus.PENDING,
        },
    });
    if (existingRequest) {
        throw new Error("Você já enviou uma solicitação pendente.");
    }
    return yield prisma.memberRequest.create({ data });
});
exports.createMemberRequest = createMemberRequest;
// Get all member requests
const getAllMemberRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.memberRequest.findMany();
});
exports.getAllMemberRequests = getAllMemberRequests;
// Update the status of a member request
const updateMemberRequestStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield prisma.memberRequest.update({
        where: { id },
        data: { status: status },
    });
    if (status === "APPROVED") {
        const token = jsonwebtoken_1.default.sign({ email: updated.email, id: updated.id }, JWT_SECRET, { expiresIn: "7d" });
        const invitation = yield prisma.invitation.create({
            data: {
                token,
                memberRequestId: updated.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        console.log("Token gerado no backend:", token);
        return Object.assign(Object.assign({}, updated), { invitationToken: invitation.token });
    }
    return updated;
});
exports.updateMemberRequestStatus = updateMemberRequestStatus;

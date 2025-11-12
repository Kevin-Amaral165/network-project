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
exports.updateMemberRequestStatus = exports.getAllMemberRequests = exports.createMemberRequest = void 0;
// Services
const memberService = __importStar(require("../services/member.service"));
/** Create a new member request */
const createMemberRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberRequest = yield memberService.createMemberRequest(req.body);
        res.status(201).json(memberRequest);
    }
    catch (error) {
        if (error.message.includes("já enviou uma solicitação")) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: "Error creating member request" });
    }
});
exports.createMemberRequest = createMemberRequest;
/** Get all member requests */
const getAllMemberRequests = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberRequests = yield memberService.getAllMemberRequests();
        res.status(200).json(memberRequests);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting member requests" });
    }
});
exports.getAllMemberRequests = getAllMemberRequests;
/** Update the status of a member request*/
const updateMemberRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = yield memberService.updateMemberRequestStatus(Number(id), status);
        console.log("Token retornado ao front:", result.invitationToken);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating member request" });
    }
});
exports.updateMemberRequestStatus = updateMemberRequestStatus;

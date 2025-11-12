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
exports.findUserByEmail = exports.getUsers = exports.createUser = void 0;
// Libraries
const client_1 = require("@prisma/client");
const prisma_1 = require("../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Create a new user with hashed password
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    return prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: data.role || prisma_1.Role.CUSTOMER,
        },
    });
});
exports.createUser = createUser;
// Get all users
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findMany();
});
exports.getUsers = getUsers;
// Find a user by email
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({ where: { email } });
});
exports.findUserByEmail = findUserByEmail;

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
// Core
const express_1 = __importDefault(require("express"));
// Libraries
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const invitation_routes_1 = __importDefault(require("./routes/invitation.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = Number(process.env.PORT) || 3001;
// ----------------------
// Middlewares
// ----------------------
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ----------------------
// Routes
// ----------------------
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/member-requests", member_routes_1.default);
app.use("/api/invitations", invitation_routes_1.default);
// Health check / test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});
// ----------------------
// Create default admin
// ----------------------
function createDefaultAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingAdmin = yield prisma.user.findUnique({
                where: { email: "admin@example.com" },
            });
            const hashedPassword = yield bcryptjs_1.default.hash("admin", 10);
            if (!existingAdmin) {
                yield prisma.user.create({
                    data: {
                        username: "admin",
                        email: "admin@example.com",
                        password: hashedPassword,
                        role: "ADMIN",
                    },
                });
                console.log(" Admin padrão criado (admin@example.com / admin)");
            }
            else if (existingAdmin.role !== "ADMIN") {
                yield prisma.user.update({
                    where: { email: "admin@example.com" },
                    data: { role: "ADMIN", password: hashedPassword },
                });
                console.log(" Usuário existente atualizado para ADMIN.");
            }
            else {
                console.log(" Admin padrão já existe e está correto.");
            }
        }
        catch (error) {
            console.error(" Erro ao criar admin padrão:", error);
        }
    });
}
// ----------------------
// Start server
// ----------------------
app.listen(PORT, "0.0.0.0", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`✅ Server running on port ${PORT}`);
    yield createDefaultAdmin();
}));
exports.default = app;

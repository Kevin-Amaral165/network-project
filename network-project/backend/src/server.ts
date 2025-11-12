// Core
import express from "express";

// Libraries
import bcryptjs from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

// Routes
import authRoutes from "./routes/auth.routes";
import invitationRoutes from "./routes/invitation.routes";
import memberRoutes from "./routes/member.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3001;

// ----------------------
// Middlewares
// ----------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/member-requests", memberRoutes);
app.use("/api/invitations", invitationRoutes);

// Health check / test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ----------------------
// Create default admin
// ----------------------
async function createDefaultAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    const hashedPassword = await bcryptjs.hash("admin", 10);

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          username: "admin",
          email: "admin@example.com",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log(" Admin padrão criado (admin@example.com / admin)");
    } else if (existingAdmin.role !== "ADMIN") {
      await prisma.user.update({
        where: { email: "admin@example.com" },
        data: { role: "ADMIN", password: hashedPassword },
      });
      console.log(" Usuário existente atualizado para ADMIN.");
    } else {
      console.log(" Admin padrão já existe e está correto.");
    }
  } catch (error) {
    console.error(" Erro ao criar admin padrão:", error);
  }
}

// ----------------------
// Start server
// ----------------------
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await createDefaultAdmin();
});

export default app;

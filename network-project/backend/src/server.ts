import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import memberRoutes from "./routes/member.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// =====================
// 🧱 Middlewares
// =====================
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

// =====================
// 🚏 Rotas
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/member-requests", memberRoutes);

// =====================
// 🌐 Rota raiz
// =====================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// =====================
// 👑 Criação do admin padrão
// =====================
async function createDefaultAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  const hashedPassword = await bcrypt.hash("admin", 10);

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin padrão criado (admin@example.com / admin)");
  } else if (existingAdmin.role !== "ADMIN") {
    await prisma.user.update({
      where: { email: "admin@example.com" },
      data: { role: "ADMIN", password: hashedPassword },
    });
    console.log("🔄 Usuário existente atualizado para ADMIN.");
  } else {
    console.log("ℹ️ Admin padrão já existe e está correto.");
  }
}


// =====================
// 🚀 Inicia o servidor
// =====================
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await createDefaultAdmin();
});

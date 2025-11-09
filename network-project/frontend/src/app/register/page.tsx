"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { Title } from "@/src/components/title";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no localStorage
        localStorage.setItem("token", data.token);

        setSuccess("Registro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/dashboard"); // página após login
        }, 2000);
      } else {
        setError(data.error || "Falha no registro");
      }
    } catch (error) {
      setError("Ocorreu um erro durante o registro");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title size="2xl" weight="bold" className="text-center mb-6">
          Registrar
        </Title>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Nome de usuário
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Botão */}
          <div className="flex items-center justify-center mt-4">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

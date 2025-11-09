"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { Title } from "@/src/components/title";
import { useUserStore } from "@/src/store/userStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { user, setUser, hydrated, loadFromStorage } = useUserStore();

  // Carrega user do localStorage ao montar o componente
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Redireciona se já estiver logado
  useEffect(() => {
    if (hydrated && user) {
      router.push("/");
    }
  }, [hydrated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user, data.token);
        router.push("/");
      } else {
        setError(data.error || "Email ou senha inválidos");
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated || (hydrated && user)) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title size="2xl" weight="bold" className="text-center mb-6">
          Login
        </Title>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <Button
              type="primary"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Entrando..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

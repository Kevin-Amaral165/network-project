"use client";

// Core
import { JSX, useState } from "react";
import { useRouter } from "next/navigation";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Components
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Title } from "../../components/title";

// Store
import { useUserStore } from "../../store/userStore";

export default function LoginPage(): JSX.Element {
  
  /** ****************************************** STATE ******************************************* */

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

/** ************************************** HANDLERS ****************************************** */

  const router: AppRouterInstance = useRouter();
  const setUser: (user: any, token: string) => void = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response: Response = await fetch("http://localhost:3001/api/auth/login", {
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

  /** ****************************************** RENDER ******************************************* */

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title size="2xl" weight="bold" className="text-center mb-6">
          Login
        </Title>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-3">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Login"}
            </Button>

            <Button
              type="primary"
              onClick={() => router.push("/register")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

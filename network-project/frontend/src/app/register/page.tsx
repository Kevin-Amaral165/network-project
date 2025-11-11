"use client";

// Core
import { JSX, useState } from "react";
import { useRouter } from "next/navigation";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Store
import { useUserStore } from "../../store/userStore";

// Components
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Title } from "../../components/title";

export default function RegisterPage(): JSX.Element {
  /** ****************************************** STATE ******************************************* */

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /** ****************************************** HANDLERS ******************************************* */
  
  const router: AppRouterInstance = useRouter();
  const setUser: (user: any, token: string) => void = useUserStore(
    (state) => state.setUser
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response: Response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user, data.token);
        router.push("/");
      } else {
        setError(data.error || "Erro ao registrar usuário");
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
        {/* Corrigido: cor do título mais escura */}
        <Title size="2xl" weight="bold" className="text-center mb-6 text-gray-800">
          Registrar
        </Title>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <input type="text" name="fakeusernameremembered" className="hidden" />
          <input type="password" name="fakepasswordremembered" className="hidden" />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Nome de usuário
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="new-username"
            />
          </div>

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
              autoComplete="new-email"
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
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-3">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </Button>

            <Button
              type="primary"
              onClick={() => router.push("/login")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Voltar para Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

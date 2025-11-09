"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { useUserStore } from "@/src/store/userStore";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout(); // limpa token e user do Zustand + localStorage
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">MyApp</div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white">Olá, {user.username}</span>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

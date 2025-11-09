"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/userStore";
import { Navbar } from "@/src/components/navbar";

export default function HomePage() {
  const router = useRouter();
  const { user, loadFromStorage, hydrated } = useUserStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return null;

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Bem-vindo à Dashboard, {user.username}!</h1>
      </div>
    </>
  );
}

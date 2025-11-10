"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/userStore";
import { Navbar } from "@/src/components/navbar";
import { Button } from "@/src/components/button";
import { MemberRequestForm } from "../app/form/page";
import { AdminDashboard } from "../app/admin/page";

export default function HomePage() {
  const router = useRouter();
  const { user, loadFromStorage, logout, hydrated } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

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
      <Navbar
        title="Dashboard"
        actions={
          <>
            <Button
              onClick={() => setIsModalVisible(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Form
            </Button>
            {user.role === "ADMIN" && (
              <Button
                onClick={() => setIsAdminModalVisible(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Admin
              </Button>
            )}
            <Button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </Button>
          </>
        }
      />

      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Bem-vindo à Dashboard, {user.username}!
        </h1>
      </div>

      <MemberRequestForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <AdminDashboard
        visible={isAdminModalVisible}
        onClose={() => setIsAdminModalVisible(false)}
      />
    </>
  );
}

"use client";

// Core
import { useEffect, useState } from "react";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

// Store
import { useUserStore } from "../store/userStore";

// App Pages
import { AdminDashboard } from "../app/admin/page";
import { MemberRequestForm } from "../app/form/page";

// Components
import { Button } from "../components/button";
import { Navbar } from "../components/navbar";
import { Title } from "../components/title";

export default function HomePage() {
  // Router
  const router: AppRouterInstance = useRouter();

  // Store
  const {
    user,
    loadFromStorage,
    logout,
    hydrated,
  } = useUserStore();

  // State
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

  // Effects
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
        <Title className="text-3xl font-bold">
          Bem-vindo à Dashboard, {user.username}!
        </Title>
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

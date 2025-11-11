"use client";

// Core
import { useEffect, useState } from "react";

// Libraries
import { useRouter } from "next/navigation";
import { Form, Input, Button as AntButton, message, Modal, Row, Col, Card, Statistic, Spin } from "antd";

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
  const router = useRouter();
  const { user, loadFromStorage, logout, hydrated } = useUserStore();

  // Modals
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

  // Token
  const [token, setToken] = useState("");

  // Stats
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyReferrals: 0,
    monthlyThanks: 0,
  });

  useEffect(() => {
    loadFromStorage();
    // Preenchimento de exemplo
    setToken("TOKEN_PRE_PREENCHIDO_EXEMPLO");
  }, [loadFromStorage]);

  // Redireciona se não logado
  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  // Carrega stats mockados
  useEffect(() => {
    if (user) {
      setLoadingStats(true);
      setTimeout(() => {
        setStats({
          totalMembers: 123,
          monthlyReferrals: 45,
          monthlyThanks: 32,
        });
        setLoadingStats(false);
      }, 1000);
    }
  }, [user]);

  if (!hydrated || !user) return null;

    const handleTokenSubmit = async () => {
    if (!token.trim()) {
      return message.error("Por favor, insira um token válido");
    }

    try {
      const response = await fetch(`http://localhost:3001/api/invitations/validate/${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        return message.error(data.error || "Token inválido ou expirado");
      }

      message.success("Token validado com sucesso!");

      // Redireciona para a tela de completar cadastro
      router.push(`/invitations/${token}`);
    } catch (error) {
      console.error("Erro ao validar token:", error);
      message.error("Erro ao validar token. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar
        title="Dashboard"
        actions={
          <>
            <Button
              onClick={() => setIsFormModalVisible(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Form
            </Button>

            {user.role === "ADMIN" && (
              <>
                <Button
                  onClick={() => setIsStatsModalVisible(true)}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Stats
                </Button>

                <Button
                  onClick={() => setIsAdminModalVisible(true)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Admin
                </Button>
              </>
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
        <Title className="text-3xl font-bold text-white">
          Bem-vindo à Dashboard, {user.username}!
        </Title>

        {/* Token */}
        <div className="mt-8 max-w-md">
          <h2 className="text-xl mb-2 text-white">Digite seu token para completar o registro:</h2>
          <Form layout="vertical" onFinish={handleTokenSubmit}>
            <Form.Item label="Token de Convite">
              <Input
                placeholder="Digite o token de convite"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit">
                Enviar Token
              </AntButton>
            </Form.Item>
          </Form>
        </div>
      </div>

      {/* Modais */}
      <MemberRequestForm
        visible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
      />

      <Modal
        title="Dashboard Admin"
        open={isStatsModalVisible}
        onCancel={() => setIsStatsModalVisible(false)}
        footer={null}
        width={800}
      >
        {loadingStats ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Membros Ativos"
                  value={stats.totalMembers}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Indicações no Mês"
                  value={stats.monthlyReferrals}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title='"Obrigados" Registrados no Mês'
                  value={stats.monthlyThanks}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Modal>

      <AdminDashboard
        visible={isAdminModalVisible}
        onClose={() => setIsAdminModalVisible(false)}
      />
    </>
  );
}

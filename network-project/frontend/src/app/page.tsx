"use client";

// Core
import { JSX, useEffect, useState } from "react";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import {
  Form,
  message,
  Modal,
  Row,
  Col,
  Card,
  Statistic,
  Spin,
} from "antd";

// Store
import { useUserStore } from "../store/userStore";

// App Pages
import AdminDashboard from "./admin/page";
import MemberRequestForm from "./form/page";

// Components
import { Button } from "../components/button/button";
import { Input } from "../components/input/input";
import { Navbar } from "../components/navbar/navbar";
import { Paragraph } from "../components/paragraph/paragraph";
import { Title } from "../components/title/title";

export default function HomePage(): JSX.Element | null {
  const router: AppRouterInstance = useRouter();
  const { user, loadFromStorage, logout, hydrated } = useUserStore();

  /** ******************************************** STATE *********************************************** */

  const [isFormModalVisible, setIsFormModalVisible] = useState<boolean>(false);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState<boolean>(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [stats, setStats] = useState<({
    totalMembers: number;
    monthlyReferrals: number;
    monthlyThanks: number;
  })>({
    totalMembers: 0,
    monthlyReferrals: 0,
    monthlyThanks: 0,
  });

   /** ****************************************** HANDLERS ******************************************* */

  const handleTokenSubmit = async (): Promise<void | boolean> => {
    if (!token.trim()) return message.error("Por favor, insira um token válido");

    try {
      const response: Response = await fetch(
        `http://localhost:3001/api/invitations/validate/${token}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const data: { error?: string } = await response.json();
      if (!response.ok) return message.error(data.error || "Token inválido ou expirado");

      message.success("Token validado com sucesso!");
      router.push(`/invitations/${token}`);
    } catch (error) {
      console.error(error);
      message.error("Erro ao validar token. Tente novamente.");
    }
  };

  /** ****************************************** EFFECTS ******************************************* */

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

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

  /** ****************************************** RENDER ******************************************* */

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar
        title="Plataforma de gestão para grupos de networking"
        actions={
          <>
            <Button onClick={() => setIsFormModalVisible(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Form
            </Button>
            {user.role === "ADMIN" && (
              <>
                <Button onClick={() => setIsStatsModalVisible(true)} className="bg-purple-500 hover:bg-purple-600 text-white rounded px-4 py-2">
                  Stats
                </Button>
                <Button onClick={() => setIsAdminModalVisible(true)} className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2">
                  Admin
                </Button>
              </>
            )}
            <Button onClick={() => { logout(); router.push("/login"); }} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
              Logout
            </Button>
          </>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1">
        <div className="flex-1 flex flex-col gap-6">
          <Card className="bg-white rounded-lg shadow p-6">
            <Title className="text-2xl font-bold mb-2">Bem-vindo à Plataforma de gestão para grupos de networking, {user.username}!</Title>
            <Paragraph>Use o painel ao lado para navegar pela plataforma.</Paragraph>
          </Card>

          <Card className="bg-white rounded-lg shadow p-6">
            <Title className="text-xl mb-2">Complete seu registro com o token</Title>
            <Form layout="vertical" onFinish={handleTokenSubmit}>
              <Form.Item label="Token de Convite">
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Digite seu token"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Enviar Token</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="bg-white rounded-lg shadow p-6">
            <Title className="text-xl mb-2">Sobre o Projeto</Title>
            <Paragraph>
              Esta aplicação é uma plataforma de gestão de membros e convites. Admins podem visualizar estatísticas e gerenciar usuários.
            </Paragraph>
            <Paragraph>Membros podem completar seu registro e enviar solicitações.</Paragraph>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {user.role === "ADMIN" && (
            <Card className="bg-white rounded-lg shadow p-6">
              <Title className="text-xl mb-4">Estatísticas Rápidas</Title>
              {loadingStats ? (
                <div className="flex justify-center items-center h-32"><Spin size="large" /></div>
              ) : (
                <Row gutter={16}>
                  <Col span={24} className="mb-4">
                    <Statistic title="Membros Ativos" value={stats.totalMembers} valueStyle={{ color: "#3f8600" }} />
                  </Col>
                  <Col span={24} className="mb-4">
                    <Statistic title="Indicações no Mês" value={stats.monthlyReferrals} valueStyle={{ color: "#1890ff" }} />
                  </Col>
                  <Col span={24}>
                    <Statistic title='"Obrigados" Registrados no Mês' value={stats.monthlyThanks} valueStyle={{ color: "#cf1322" }} />
                  </Col>
                </Row>
              )}
            </Card>
          )}
        </div>
      </div>

      <MemberRequestForm visible={isFormModalVisible} onClose={() => setIsFormModalVisible(false)} />

      <Modal title="Dashboard Admin" open={isStatsModalVisible} onCancel={() => setIsStatsModalVisible(false)} footer={null} width={800}>
        {loadingStats ? (
          <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
        ) : (
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Membros Ativos" value={stats.totalMembers} valueStyle={{ color: "#3f8600" }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Indicações no Mês" value={stats.monthlyReferrals} valueStyle={{ color: "#1890ff" }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title='"Obrigados" Registrados no Mês' value={stats.monthlyThanks} valueStyle={{ color: "#cf1322" }} />
              </Card>
            </Col>
          </Row>
        )}
      </Modal>

      <AdminDashboard visible={isAdminModalVisible} onClose={() => setIsAdminModalVisible(false)} />
    </div>
  );
}

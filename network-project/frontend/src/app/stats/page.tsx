"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { useUserStore } from "../../store/userStore";

export default function StatsPage() {
  const router = useRouter();
  const { user, loadFromStorage, hydrated } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    monthlyReferrals: 0,
    monthlyThanks: 0,
  });

  // Carrega o usuário do storage
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  // Simula carregamento dos dados
  useEffect(() => {
    if (user) {
      // Aqui você pode substituir por uma chamada ao backend
      setTimeout(() => {
        setStats({
          totalMembers: 123,       // número total de membros ativos
          monthlyReferrals: 45,    // total de indicações do mês
          monthlyThanks: 32,       // total de "obrigados" registrados no mês
        });
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (!hydrated || !user || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

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
    </div>
  );
}

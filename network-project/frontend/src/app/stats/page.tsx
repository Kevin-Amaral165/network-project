"use client";

// Core
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  Card,
  Row,
  Col,
  Statistic,
  Spin
} from "antd";

// Store
import { useUserStore } from "../../store/userStore";

// Components
import { Title } from "../../components/title/title";

export default function StatsPage(): JSX.Element {
  const router: AppRouterInstance = useRouter();
  const { user, loadFromStorage, hydrated } = useUserStore();

   /** ****************************************** STATE ******************************************* */

  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{
    totalMembers: number;
    monthlyReferrals: number;
    monthlyThanks: number;
  }>({
    totalMembers: 0,
    monthlyReferrals: 0,
    monthlyThanks: 0,
  });

    /** ****************************************** LOADING ******************************************* */

  if (!hydrated || !user || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

   /** ****************************************** EFFECTS ******************************************* */

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setStats({
          totalMembers: 123,
          monthlyReferrals: 45,
          monthlyThanks: 32,
        });
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  /** ****************************************** RENDER ******************************************* */

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <Title className="text-3xl font-bold mb-8">Dashboard</Title>

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

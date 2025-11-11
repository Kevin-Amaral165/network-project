"use client";

import { Modal, Table, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/userStore";

interface AdminDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export const AdminDashboard = ({ visible, onClose }: AdminDashboardProps) => {
  const [memberRequests, setMemberRequests] = useState<any[]>([]);
  const { user } = useUserStore();

  const fetchMemberRequests = async () => {
    try {
      console.log("Fetching member requests..."); // 🔹 log inicial
      const { data } = await axios.get(
        "http://localhost:3001/api/member-requests",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Fetched data from backend:", data); // 🔹 log do backend
      setMemberRequests(data);
      console.log("State updated, memberRequests:", memberRequests); // 🔹 log do state (observe que useState é assíncrono)
    } catch (error) {
      console.error("Error fetching member requests", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchMemberRequests();
    }
  }, [visible]);

  const handleApprove = async (id: number) => {
  try {
    console.log(`Approving member request id=${id}`);
    const { data } = await axios.put(
      `http://localhost:3001/api/member-requests/${id}`,
      { status: "APPROVED" },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    console.log("🎟️ Token recebido do backend:", data.invitationToken);

    fetchMemberRequests();
  } catch (error) {
    console.error("Error approving member request", error);
  }
};

  const handleReject = async (id: number) => {
    try {
      console.log(`Rejecting member request id=${id}`); // 🔹 log de ação
      await axios.put(
        `http://localhost:3001/api/member-requests/${id}`,
        { status: "REJECTED" },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      fetchMemberRequests();
    } catch (error) {
      console.error("Error rejecting member request", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "APPROVED") return <span style={{ color: "green" }}>Aprovado</span>;
        if (status === "REJECTED") return <span style={{ color: "red" }}>Rejeitado</span>;
        return <span style={{ color: "orange" }}>Pendente</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        if (record.status !== "PENDING") {
          return <span>-</span>;
        }

        return (
          <span>
            <Button type="primary" onClick={() => handleApprove(record.id)}>
              Aprovar
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleReject(record.id)}
              style={{ marginLeft: 8 }}
            >
              Rejeitar
            </Button>
          </span>
        );
      },
    },
  ];

  return (
    <Modal
      title="Admin Dashboard"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <h4>DEBUG: number of requests = {memberRequests.length}</h4> {/* 🔹 log visual */}
      <Table dataSource={memberRequests} columns={columns} rowKey="id" />
    </Modal>
  );
};

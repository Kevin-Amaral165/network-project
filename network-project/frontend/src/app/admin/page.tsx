"use client";

// Core
import { useEffect, useState, JSX } from "react";

// Libraries
import { Modal, Table, message } from "antd";

// Store
import { useUserStore } from "@/src/store/userStore";

// Components
import { Button } from "../../components/button";

interface AdminDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export default function AdminDashboard({
  visible,
  onClose,
}: AdminDashboardProps): JSX.Element {
  const { user } = useUserStore();

  /** *************************************** STATE ****************************************** */

  const [memberRequests, setMemberRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** *************************************** HANDLERS ****************************** */

  const fetchMemberRequests = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response: Response = await fetch("http://localhost:3001/api/member-requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch member requests");

      const data = await response.json();
      setMemberRequests(data);
    } catch (error) {
      console.error("Error fetching member requests:", error);
      message.error("Failed to load member requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number): Promise<void> => {
    try {
      const response: Response = await fetch(
        `http://localhost:3001/api/member-requests/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "APPROVED" }),
        }
      );

      if (!response.ok) throw new Error("Failed to approve request");

      const data = await response.json();
      console.log("Token received from backend:", data.invitationToken);

      message.success("Request approved successfully!");
      fetchMemberRequests();
    } catch (error) {
      console.error("Error approving member request:", error);
      message.error("Error approving request.");
    }
  };

  const handleReject = async (id: number): Promise<void> => {
    try {
      const response: Response = await fetch(
        `http://localhost:3001/api/member-requests/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject request");

      message.warning("Request rejected.");
      fetchMemberRequests();
    } catch (error) {
      console.error("Error rejecting member request:", error);
      message.error("Error rejecting request.");
    }
  };

  /** *************************************** EFFECTS ****************************************** */

  useEffect(() => {
    if (visible) fetchMemberRequests();
  }, [visible]);

  /** *************************************** RENDER ******************************************* */

  const columns: any[] = [
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
        if (status === "APPROVED")
          return <span style={{ color: "green" }}>Approved</span>;
        if (status === "REJECTED")
          return <span style={{ color: "red" }}>Rejected</span>;
        return <span style={{ color: "orange" }}>Pending</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        if (record.status !== "PENDING") return <span>-</span>;

        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(record.id)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleReject(record.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      title="Admin Dashboard"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <Table
        dataSource={memberRequests}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
    </Modal>
  );
}

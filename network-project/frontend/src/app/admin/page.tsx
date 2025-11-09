"use client";

import { useEffect, useState } from "react";
import withAuth from "../../hooks/withAuth";
import { Button } from "@/src/components/button";
import { Table } from "@/src/components/table";
import { Title } from "@/src/components/title";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/admin/users/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError("Failed to approve user");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleRecuse = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/admin/users/${id}/recuse`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setError("Failed to recuse user");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: User) => (
        <>
          <Button
            onClick={() => handleApprove(record.id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
          >
            Approve
          </Button>
          <Button
            onClick={() => handleRecuse(record.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Recuse
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <Title
          size="2xl"
          weight="bold"
          className="mb-6 text-center text-gray-800"
        >
          Admin Panel
        </Title>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Table
          columns={columns}
          dataSource={users}
          className="table-testId"
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  );
}

export default withAuth(AdminPage);

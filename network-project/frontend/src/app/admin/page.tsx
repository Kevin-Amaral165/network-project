"use client"; // 👈 Adicione isso no topo

import { Button } from "@/src/components/button";
import { Table } from "@/src/components/table";
import { Title } from "@/src/components/title";

export default function AdminPage() {
  const data = [
    { id: 1, name: "Kevin Amaral", email: "kevin.amaral@example.com", phone: "123-456-7890" },
    { id: 2, name: "Kevin Ramos", email: "kevin.ramos@example.com", phone: "098-765-4321" },
  ];

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
      render: (_: any, record: any) => (
        <>
          <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">
            Approve
          </Button>
          <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
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

        <Table
          columns={columns}
          dataSource={data}
          className="table-testId"
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  );
}

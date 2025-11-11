"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Input, Button, message, DatePicker } from "antd";

const CompleteRegisterPage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/invitations/validate/${token}`,
          { method: "POST" }
        );
        setIsValid(response.ok);
      } catch (error) {
        console.error(error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) validateToken();
  }, [token]);

  // Alteração aqui: não faz requisição, apenas alerta e redireciona
  const onFinish = async (values: any) => {
    alert("Cadastro efetuado com sucesso!");
    router.push("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isValid) return <div style={{ color: "white" }}>Invalid or expired token</div>;

  return (
    <div className="p-8 max-w-md mx-auto" style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "white" }}>
        Complete seu cadastro
      </h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="firstName"
          label={<span style={{ color: "white" }}>Nome</span>}
          rules={[{ required: true, message: "Por favor, insira seu nome" }]}
        >
          <Input style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={<span style={{ color: "white" }}>Sobrenome</span>}
          rules={[{ required: true, message: "Por favor, insira seu sobrenome" }]}
        >
          <Input style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="city"
          label={<span style={{ color: "white" }}>Cidade</span>}
          rules={[{ required: true, message: "Por favor, insira sua cidade" }]}
        >
          <Input style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="state"
          label={<span style={{ color: "white" }}>Estado</span>}
          rules={[{ required: true, message: "Por favor, insira seu estado" }]}
        >
          <Input style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={<span style={{ color: "white" }}>Telefone</span>}
        >
          <Input style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="cpf"
          label={<span style={{ color: "white" }}>CPF</span>}
          rules={[
            { required: true, message: "Por favor, insira seu CPF" },
            { pattern: /^\d{11}$/, message: "CPF deve conter 11 dígitos numéricos" },
          ]}
        >
          <Input maxLength={11} style={{ color: "white", backgroundColor: "#222", borderColor: "#555" }} />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label={<span style={{ color: "white" }}>Data de nascimento</span>}
          rules={[{ required: true, message: "Por favor, insira sua data de nascimento" }]}
        >
          <DatePicker
            style={{ width: "100%", color: "white", backgroundColor: "#222", borderColor: "#555" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Finalizar Cadastro
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompleteRegisterPage;

"use client";

// Core
import { JSX, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Libraries
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  Modal,
  Spin,
  Form,
} from "antd";

// Components
import { Input } from "../../../components/input";

export default function InvitationTokenPage(): JSX.Element {
  const router: AppRouterInstance = useRouter();
  const { token } = useParams();

  /** ****************************************** STATE ******************************************* */

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  /** *************************************** HANDLERS ****************************************** */

  const [form] = Form.useForm();

   const handleFinish = async (): Promise<void> => {
    try {
      const values: Record<string, any> = await form.validateFields();
      console.log("Dados preenchidos:", values);
      alert("Cadastro efetuado com sucesso!");
      setModalOpen(false);
      router.push("/");
    } catch (error) {
      alert("Preencha todos os campos corretamente!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Carregando convite..." />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Convite inválido ou expirado.</p>
      </div>
    );
  }

  /** *************************************** EFFECTS ****************************************** */

  useEffect(() => {
    const validateToken = async (): Promise<void> => {
      try {
        const jwt: string | null = localStorage.getItem("token");
        if (!jwt) {
          console.error("Usuário não autenticado.");
          setIsValid(false);
          return;
        }

        const decoded: { email?: string } = JSON.parse(atob(jwt.split(".")[1]));
        const userEmail: string | undefined = decoded?.email;

        const response: Response = await fetch(
          `http://localhost:3001/api/invitations/validate/${token}?email=${userEmail}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        const data: { valid?: boolean } = await response.json();

        if (response.ok && data.valid) {
          setIsValid(true);
          setModalOpen(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) validateToken();
  }, [token]);

  /** *************************************** RENDER ******************************************* */

  return (
    <Modal
      open={modalOpen}
      title="Complete seu cadastro"
      onOk={handleFinish}
      onCancel={() => setModalOpen(false)}
      okText="Concluir"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="firstName"
          label="Nome"
          rules={[{ required: true, message: "Informe seu nome" }]}
        >
          <Input placeholder="Digite seu nome" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Sobrenome"
          rules={[{ required: true, message: "Informe seu sobrenome" }]}
        >
          <Input placeholder="Digite seu sobrenome" />
        </Form.Item>

        <Form.Item
          name="city"
          label="Cidade"
          rules={[{ required: true, message: "Informe sua cidade" }]}
        >
          <Input placeholder="Digite sua cidade" />
        </Form.Item>

        <Form.Item
          name="state"
          label="Estado"
          rules={[{ required: true, message: "Informe seu estado" }]}
        >
          <Input placeholder="Digite seu estado" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Número de telefone"
          rules={[{ required: true, message: "Informe seu telefone" }]}
        >
          <Input placeholder="(xx) xxxxx-xxxx" />
        </Form.Item>

        <Form.Item
          name="cpf"
          label="CPF"
          rules={[{ required: true, message: "Informe seu CPF" }]}
        >
          <Input placeholder="000.000.000-00" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

"use client";

// Core
import { JSX, useState } from "react";

// Libraries
import {Modal, Form, message } from "antd";

// Components
import { Button } from "../../components/button/button";
import { Input } from "../../components/input/input";

interface MemberRequestFormProps {
  visible: boolean;
  onClose: () => void;
}

export default function MemberRequestForm({
  visible,
  onClose,
}: MemberRequestFormProps): JSX.Element {
  const [form] = Form.useForm();

  /** *************************************** STATE ****************************** */

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /** *************************************** HANDLERS ****************************** */

  const handleSubmit = async (values: Record<string, string>): Promise<void> => {
    try {
      setIsSubmitting(true);

      const response: Response = await fetch("http://localhost:3001/api/member-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit member request");
      }

      message.success("Request sent successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** *************************************** RENDER ******************************************* */

  return (
    <Modal
      title="Member Request Form"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={isSubmitting}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: "Please enter your company" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Por que você quer participar?"
          rules={[
            { required: true, message: "Please tell us why you want to join" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

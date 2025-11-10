import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";

interface MemberRequestFormProps {
  visible: boolean;
  onClose: () => void;
}

export const MemberRequestForm = ({
  visible,
  onClose,
}: MemberRequestFormProps) => {
  const [form] = useForm();

  const handleSubmit = async (values: any) => {
    try {
      await axios.post("http://localhost:3001/api/member-requests", values);
      onClose();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Modal
      title="Member Request Form"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="Nome"
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
          label="Empresa"
          rules={[{ required: true, message: "Please enter your company" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Por que você quer participar?"
          rules={[
            {
              required: true,
              message: "Please tell us why you want to join",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Modal, Button } from "antd";

const InvitePage = () => {
  const { token } = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/invitations/validate/${token}`,
          { method: "POST" }
        );

        if (response.ok) {
          setIsValid(true);
          setModalOpen(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error validating token", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) validateToken();
  }, [token]);

  if (isLoading) return <div>Loading...</div>;

  if (!isValid) return <div>Invalid or expired token</div>;

  return (
    <Modal
      open={modalOpen}
      title="You're invited!"
      onOk={() => router.push(`/register/${token}`)}
      onCancel={() => setModalOpen(false)}
      okText="Register"
    >
      <p>Your invitation is valid! Click Register to complete your signup.</p>
    </Modal>
  );
};

export default InvitePage;

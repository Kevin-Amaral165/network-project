"use client";

// Core
import { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Libraries
import { Modal } from "antd";

export default function InvitePage(): JSX.Element {
  const { token } = useParams();
  const router = useRouter();

  /** *************************************** STATE ****************************************** */

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  /** *************************************** EFFECTS ****************************************** */

  useEffect(() => {
    const validateToken = async (): Promise<void> => {
      try {
        const response: Response = await fetch(
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

  /** *************************************** RENDER ******************************************* */
  
  if (isLoading) return <div>Loading...</div>;
  if (!isValid) return <div>Invalid or expired token</div>;

  return (
    <Modal
      open={modalOpen}
      title="You're invited!"
      onOk={() => router.push(`/invitations/${token}`)}
      onCancel={() => setModalOpen(false)}
      okText="Register"
    >
      <p>Your invitation is valid! Click Register to complete your signup.</p>
    </Modal>
  );
}

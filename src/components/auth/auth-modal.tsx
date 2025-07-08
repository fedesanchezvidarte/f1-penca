"use client";

import { Modal, ModalContent } from "@heroui/react";
import { SignInModalCard } from "@/components/auth/signin-modal-card";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthModal() {
  const { data: session } = useSession();
  const { isOpen, onClose } = useAuthModal();

  // Close the modal when the user is logged in
  useEffect(() => {
    if (session && isOpen) {
      onClose();
    }
  }, [session, isOpen, onClose]);

  return (
    <Modal 
      backdrop="blur" 
      isOpen={isOpen} 
      onClose={onClose}
      hideCloseButton={false}
      className="max-w-md"
      placement="center"
    >
      <ModalContent className="p-0 overflow-hidden m-8">
        <SignInModalCard />
      </ModalContent>
    </Modal>
  );
}

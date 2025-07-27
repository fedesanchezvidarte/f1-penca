"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useDisclosure } from "@heroui/react";

interface AuthModalContextType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  openModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <AuthModalContext.Provider value={{ isOpen, onOpen, onClose, openModal: onOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

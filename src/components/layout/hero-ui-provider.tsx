"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ReactNode } from "react";

interface HeroUIProviderWrapperProps {
  children: ReactNode;
}

export function HeroUIProviderWrapper({ children }: HeroUIProviderWrapperProps) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      {children}
    </HeroUIProvider>
  );
}
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardHeader,
} from "@heroui/react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NextImage from "next/image";

export const UserIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const LockIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M12.0011 17.3498C12.9013 17.3498 13.6311 16.6201 13.6311 15.7198C13.6311 14.8196 12.9013 14.0898 12.0011 14.0898C11.1009 14.0898 10.3711 14.8196 10.3711 15.7198C10.3711 16.6201 11.1009 17.3498 12.0011 17.3498Z"
        fill="currentColor"
      />
      <path
        d="M18.28 9.53V8.28C18.28 5.58 17.63 2 12 2C6.37 2 5.72 5.58 5.72 8.28V9.53C2.92 9.88 2 11.3 2 14.79V16.65C2 20.75 3.25 22 7.35 22H16.65C20.75 22 22 20.75 22 16.65V14.79C22 11.3 21.08 9.88 18.28 9.53ZM12 18.74C10.33 18.74 8.98 17.38 8.98 15.72C8.98 14.05 10.34 12.7 12 12.7C13.66 12.7 15.02 14.06 15.02 15.72C15.02 17.39 13.67 18.74 12 18.74ZM7.35 9.44C7.27 9.44 7.2 9.44 7.12 9.44V8.28C7.12 5.35 7.95 3.4 12 3.4C16.05 3.4 16.88 5.35 16.88 8.28V9.45C16.8 9.45 16.73 9.45 16.65 9.45H7.35V9.44Z"
        fill="currentColor"
      />
    </svg>
  );
};

export function SignInFormModal() {
  const { data: session } = useSession();
  const { isOpen, onClose } = useAuthModal();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Close the modal when the user is logged in
  useEffect(() => {
    if (session && isOpen) {
      onClose();
    }
  }, [session, isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email/username or password");
      } else {
        // Success - modal will close automatically via useEffect
        setIdentifier("");
        setPassword("");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="relative">
          {/* Hero Header */}
          <Card className="border-themed">
            <CardHeader className="flex flex-col items-center justify-center text-center w-full pt-6 pb-4">
              <NextImage
                src="/brand/f1-penca-logo.svg"
                alt="F1 Penca Logo"
                width={50}
                height={0}
                style={{ height: "auto" }}
                className="mb-3"
              />
              <h1 className="text-foreground font-bold text-3xl">F1 Penca</h1>
              <p className="text-muted text-sm mt-1">Beta Access</p>
            </CardHeader>
          </Card>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1 pt-6">
              <h2 className="text-xl font-semibold">Sign In</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                endContent={
                  <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email or Username"
                placeholder="Enter your email or username"
                variant="bordered"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="mb-4"
                classNames={{
                  input: "text-base", // Ensures 16px font size to prevent mobile zoom
                }}
              />
              <Input
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                classNames={{
                  input: "text-base", // Ensures 16px font size to prevent mobile zoom
                }}
              />
              {error && (
                <p className="text-danger text-sm mt-2">{error}</p>
              )}
              <div className="text-center mt-4">
                <p className="text-muted text-xs">
                  Beta users: Use your email/username and password &apos;password&apos;
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="default" 
                variant="light" 
                onPress={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                color="primary" 
                className="btn-f1-red"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </ModalFooter>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
}

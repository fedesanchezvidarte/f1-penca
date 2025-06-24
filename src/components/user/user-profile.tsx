"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { SignOutButton } from "../auth/sign-out-button";

export function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-full bg-gray-800 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-800 animate-pulse"></div>
      </div>
    );
  }
  
  if (status === "unauthenticated" || !session) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
            {session.user.name?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="font-medium">{session.user.name}</p>
          <p className="text-sm text-gray-400">{session.user.email}</p>
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}

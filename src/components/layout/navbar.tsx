"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserProfile } from "../user/user-profile";
import { useSession } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/brand/f1-penca-logo.svg" 
              alt="F1 Penca Logo" 
              width={32} 
              height={16} 
              className="logo-accent-red" 
            />
            <span className="text-2xl font-bold text-gray-100">F1 Penca</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive("/")
                  ? "text-gray-100"
                  : "text-gray-400 hover:text-gray-100"
              }`}
            >
              Home
            </Link>
            
            {status === "authenticated" && (
              <>
                <Link
                  href="/predictions"
                  className={`text-sm font-medium ${
                    isActive("/predictions") || pathname.startsWith("/predictions")
                      ? "text-gray-100"
                      : "text-gray-400 hover:text-gray-100"
                  }`}
                >
                  My Predictions
                </Link>
                
                <Link
                  href="/leaderboard"
                  className={`text-sm font-medium ${
                    isActive("/leaderboard")
                      ? "text-gray-100"
                      : "text-gray-400 hover:text-gray-100"
                  }`}
                >
                  Leaderboard
                </Link>
              </>
            )}
            
            <Link
              href="/races"
              className={`text-sm font-medium ${
                isActive("/races") || pathname.startsWith("/races")
                  ? "text-gray-100"
                  : "text-gray-400 hover:text-gray-100"
              }`}
            >
              Races
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          {status === "authenticated" ? (
            <UserProfile />
          ) : status === "unauthenticated" ? (
            <Link href="/auth/signin">
              <button className="btn-primary">Sign In</button>
            </Link>
          ) : (
            <div className="h-10 w-24 bg-gray-800 animate-pulse rounded-xl"></div>
          )}
        </div>
      </div>
    </nav>
  );
}

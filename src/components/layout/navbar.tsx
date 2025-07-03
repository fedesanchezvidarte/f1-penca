"use client";

import React from "react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserProfile } from "../user/user-profile";
import { useSession } from "next-auth/react";

// F1 Penca Logo Component
export const F1PencaLogo = () => {
  return (
    <Image
      src="/brand/f1-penca-logo.svg"
      alt="F1 Penca Logo"
      width={28}
      height={14}
      className="logo-accent-red"
    />
  );
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { status } = useSession();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard", requiresAuth: true },
    { name: "My Predictions", href: "/predictions", requiresAuth: true },
    { name: "Races", href: "/races" },
  ];

  return (
    <HeroNavbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-900 border-b border-gray-800">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center space-x-2">
            <F1PencaLogo />
            <span className="text-xl font-bold text-gray-100">F1 Penca</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Tabs 
          aria-label="Navigation tabs" 
          variant="underlined"
          selectedKey={pathname}
          className="flex gap-4"
        >
          {menuItems.map((item) => (
            <Tab
              key={item.href}
              href={item.href}
              title={item.name}
              isDisabled={item.requiresAuth && status !== "authenticated"}
            />
          ))}
        </Tabs>
      </NavbarContent>

      <NavbarContent justify="end">
        {status === "authenticated" ? (
          <NavbarItem>
            <UserProfile />
          </NavbarItem>
        ) : status === "unauthenticated" ? (
          <NavbarItem>
            <Button 
              as={Link} 
              href="/auth/signin" 
              variant="solid"
              size="sm"
              radius="md"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sign In
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <div className="h-8 w-20 bg-gray-800 animate-pulse rounded-md"></div>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className={`w-full ${
                item.requiresAuth && status !== "authenticated"
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              color={isActive(item.href) ? "primary" : "foreground"}
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroNavbar>
  );
}

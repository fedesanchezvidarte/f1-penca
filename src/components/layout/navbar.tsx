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
import { useAuthModal } from "../auth/auth-modal-context";

// F1 Penca Logo Component
export const F1PencaLogo = () => {
  return (
    <Image
      src="/brand/f1-penca-logo.svg"
      alt="F1 Penca Logo"
      width={28}
      height={0}
      style={{ height: "auto" }}
    />
  );
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { onOpen } = useAuthModal();

  // Track authentication state to prevent flickering
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);
  
  // More robust authentication check with memoization
  const isAuthenticated = React.useMemo(() => {
    return status === "authenticated" && session?.user;
  }, [status, session?.user]);

  // Update the wasAuthenticated state when user logs in
  React.useEffect(() => {
    if (isAuthenticated) {
      setWasAuthenticated(true);
    } else if (status === "unauthenticated") {
      setWasAuthenticated(false);
    }
  }, [isAuthenticated, status]);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Races", href: "/races" },
  ];

  // Prevent hydration mismatch by using the current pathname for selection
  const selectedKey = React.useMemo(() => {
    return pathname;
  }, [pathname]);

  return (
    <HeroNavbar 
      onMenuOpenChange={setIsMenuOpen} 
      className="border-themed-bottom"
      maxWidth="full"
      isBordered={false}
    >
      <NavbarContent className="navbar-content">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center space-x-2">
            <F1PencaLogo />
            <span className="text-xl font-bold text-foreground">F1 Penca</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Tabs 
          aria-label="Navigation tabs" 
          variant="underlined"
          selectedKey={selectedKey}
          color="primary"
          className="navbar-tabs"
          disableAnimation={false}
          classNames={{
            tab: "transition-colors duration-200 hover:text-primary",
            cursor: "transition-all duration-300 bg-primary"
          }}
        >
          {menuItems.map((item) => (
            <Tab
              key={item.href}
              href={item.href}
              title={item.name}
            />
          ))}
        </Tabs>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="min-w-[120px] flex justify-end">
          {isAuthenticated ? (
            <UserProfile />
          ) : status === "loading" && wasAuthenticated ? (
            // Show loading state if user was authenticated before (prevents flickering)
            <div className="h-8 w-20 bg-content2 animate-pulse rounded"></div>
          ) : status === "loading" ? (
            // Show loading state for initial load
            <div className="h-8 w-20 bg-content2 animate-pulse rounded"></div>
          ) : (
            <Button 
              onPress={onOpen}
              color="primary"
              variant="solid"
              size="sm"
              radius="md"
              className="btn-f1-red w-20"
            >
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className="w-full"
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

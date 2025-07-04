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
      height={14}
    />
  );
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const { onOpen } = useAuthModal();

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
      className="border-line-bottom"
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
            <span className="text-xl font-bold text-gray-100">F1 Penca</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Tabs 
          aria-label="Navigation tabs" 
          variant="underlined"
          selectedKey={selectedKey}
          className="navbar-tabs"
          disableAnimation={false}
          classNames={{
            tab: "transition-colors duration-200 hover:text-red-500",
            cursor: "transition-all duration-300"
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
          {status === "authenticated" ? (
            <UserProfile />
          ) : (
            <Button 
              onPress={onOpen}
              variant="solid"
              size="sm"
              radius="md"
              className="btn-red-gradient text-white w-20"
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

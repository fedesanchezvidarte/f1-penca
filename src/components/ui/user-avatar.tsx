"use client";

import { Avatar } from "@heroui/react";

interface UserAvatarProps {
    name?: string | null;
    image?: string | null;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function UserAvatar({ name, image, size = "sm", className }: UserAvatarProps) {
    const displayName = name || "User";
    const initial = displayName.charAt(0).toUpperCase();

    if (image) {
        return (
            <Avatar
                src={image}
                name={displayName}
                size={size}
                className={className}
            />
        );
    }

    return (
        <Avatar
            name={initial}
            size={size}
            className={className}
            classNames={{
                base: "bg-primary text-primary-foreground",
                name: "font-bold text-white"
            }}
        />
    );
}

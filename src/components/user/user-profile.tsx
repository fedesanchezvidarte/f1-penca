"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { SignOutButton } from "../auth/sign-out-button";

export function UserProfile() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div className="flex items-center space-x-2">
				<div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse"></div>
				<div className="h-4 w-20 bg-gray-800 animate-pulse"></div>
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
						width={32}
						height={32}
						className="rounded-full"
					/>
				) : (
					<div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">
						{session.user.name?.charAt(0) || "U"}
					</div>
				)}
			</div>
			<SignOutButton />
		</div>
	);
}

"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@heroui/react";

export function SignOutButton() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await signOut({ callbackUrl: "/" });
		} catch (error) {
			console.error("Error signing out", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onPress={handleSignOut}
			isLoading={isLoading}
			color="default"
			variant="ghost"
			size="sm"
			radius="md"
			startContent={
				!isLoading && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
						/>
					</svg>
				)
			}
		>
			{!isLoading && "Sign Out"}
		</Button>
	);
}

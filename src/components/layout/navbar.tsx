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
		if (path === "/") {
			return pathname === path;
		}
		return pathname === path || pathname.startsWith(path);
	};

	return (
		<nav className="bg-gray-900 border-b border-gray-800 py-4 px-4">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
				<div className="flex items-center space-x-4">
					<Link href="/" className="flex items-center space-x-2">
						<Image
							src="/brand/f1-penca-logo.svg"
							alt="F1 Penca Logo"
							width={28}
							height={14}
							className="logo-accent-red"
						/>
						<span className="text-xl font-bold text-gray-100">F1 Penca</span>
					</Link>
				</div>

				<div className="flex justify-center mt-4 md:mt-0">
					<div className="inline-flex overflow-hidden">
						<Link
							href="/"
							className={`nav-link ${
								isActive("/") ? "nav-link-active" : "nav-link-inactive"
							}`}
						>
							Home
						</Link>

						<Link
							href="/leaderboard"
							className={`nav-link ${
								isActive("/leaderboard")
									? "nav-link-active"
									: `nav-link-inactive ${
											status !== "authenticated"
												? "opacity-50 pointer-events-none"
												: ""
									  }`
							}`}
						>
							Leaderboard
						</Link>

						<Link
							href="/predictions"
							className={`nav-link ${
								isActive("/predictions")
									? "nav-link-active"
									: `nav-link-inactive ${
											status !== "authenticated"
												? "opacity-50 pointer-events-none"
												: ""
									  }`
							}`}
						>
							My Predictions
						</Link>

						<Link
							href="/races"
							className={`nav-link ${
								isActive("/races") ? "nav-link-active" : "nav-link-inactive"
							}`}
						>
							Races
						</Link>
					</div>
				</div>

				<div className="flex items-center mt-4 md:mt-0">
					{status === "authenticated" ? (
						<UserProfile />
					) : status === "unauthenticated" ? (
						<Link href="/auth/signin">
							<button className="btn btn-md btn-solid">Sign In</button>
						</Link>
					) : (
						<div className="h-8 w-20 bg-gray-800 animate-pulse rounded-md"></div>
					)}
				</div>
			</div>
		</nav>
	);
}

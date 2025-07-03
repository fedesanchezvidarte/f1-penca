"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
	return (
		<footer className="border-line-top py-8 px-6">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<div className="flex items-center space-x-2">
					<Image
						src="/brand/f1-penca-logo.svg"
						alt="F1 Penca Logo"
						width={24}
						height={12}
						className="logo-accent-red"
					/>
					<span className="text-sm text-gray-400">
						© {new Date().getFullYear()} F1 Penca
					</span>
				</div>

				<div className="flex items-center space-x-6">
					{" "}
					<Link
						href="https://github.com/fedesanchezvidarte/f1-penca"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
					>
						GitHub
					</Link>
					<Link
						href="https://github.com/fedesanchezvidarte/f1-penca/blob/main/LICENSE"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
					>
						Open Source
					</Link>
					<Link
						href="https://buymeacoffee.com/fedesanchezvidarte"
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors"
					>
						☕ Buy Me a Coffee
					</Link>
				</div>
			</div>
		</footer>
	);
}

"use client";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardHeader, CardFooter, Image } from "@heroui/react";
import NextImage from "next/image";

export function SignInModalCard() {
	return (
		<Card isFooterBlurred className="w-full h-[250px] sm:h-[400px] border-themed">
			<CardHeader className="absolute z-10 top-1 flex-col items-center justify-center text-center w-full pt-4 sm:pt-8">
				<NextImage
					src="/brand/f1-penca-logo.svg"
					alt="F1 Penca Logo"
					width={50}
					height={0}
					style={{ height: "auto" }}
					className="mb-2 sm:mb-4 sm:w-[60px]"
				/>
				<h1 className="text-foreground font-bold text-4xl sm:text-6xl">F1 Penca</h1>
			</CardHeader>
			<Image
				removeWrapper
				alt="F1 background with sparks"
				className="z-0 w-full h-full object-cover rounded-large"
				src="/images/f1-dark-wallpaper.jpg"
			/>
			<CardFooter className="absolute bg-black/40 bottom-0 z-10 border-themed-top py-4 sm:py-6">
				<div className="flex justify-center w-full">
					<div className="w-40 sm:w-48">
						<GoogleSignInButton />
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}

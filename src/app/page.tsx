"use client";

import {Button} from "@heroui/react";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
			<main className="flex flex-col items-center gap-8 max-w-2xl text-center">
				<h1 className="text-4xl font-bold text-gray-100">F1 Penca</h1>
				<p className="text-xl text-gray-400 mb-4">
					Predict F1 race results and compete with your friends
				</p>

				<div className="flex gap-4 flex-col sm:flex-row">
					<Button
						as="a"
						href="/auth/signin"
						className="bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-lg"
						radius="md"
					>
						Get Started
					</Button>
					<Button
						as="a"
						href="/about"
						color="default"
						className="text-white"
						variant="flat"
					>
						About the Project
					</Button>
				</div>
			</main>
		</div>
	);
}

"use client";

import {Button} from "@heroui/react";

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto text-center">
				<h1 className="text-4xl font-bold text-gray-100">F1 Penca</h1>
				<p className="text-xl text-gray-400 mb-4">
					Predict F1 race results and compete with your friends
				</p>

				<div className="flex gap-4 flex-col sm:flex-row">
					<Button
						as="a"
						href="/auth/signin"
						className="btn-red-gradient text-white"
						radius="md"
					>
						Get Started
					</Button>
					<Button
						as="a"
						href="/about"
						color="default"
						className="btn-blue-teal-gradient text-white"
						variant="flat"
					>
						About the Project
					</Button>
				</div>
			</div>
		</div>
	);
}

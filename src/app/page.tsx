"use client";

import { Button, Card, CardHeader, CardBody, Link } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/auth-modal-context";

export default function Home() {
	const { data: session } = useSession();
	const router = useRouter();
	const { onOpen } = useAuthModal();

	const handleGetStarted = () => {
		if (session) {
			// If the user is logged in, redirect to the leaderboard
			router.push("/leaderboard");
		} else {
			// Otherwise, open the modal
			onOpen();
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-center min-h-[70vh]">
				<Card className="max-w-xl w-full bg-black/20 border border-gray-500/50">
					<CardHeader className="flex flex-col items-center pt-16 pb-6">
						<h1 className="text-6xl font-bold text-gray-100 mb-2">F1 Penca</h1>
						<p className="text-xl text-gray-400 text-center">
							Lights out and away we go!
						</p>
					</CardHeader>
					<CardBody className="flex flex-col items-center gap-6 pb-16">
						<div className="flex gap-4 flex-col sm:flex-row">
							<Button
								onPress={handleGetStarted}
								className="btn-red-gradient text-white"
								radius="md"
								size="lg"
							>
								Get Started
							</Button>
							<Button
								showAnchorIcon
								as={Link}
								href="https://github.com/fedesanchezvidarte/f1-penca"
								target="_blank"
								rel="noopener noreferrer"
								color="default"
								className="btn-blue-teal-gradient text-white"
								variant="flat"
								size="lg"
							>
								About the Project
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

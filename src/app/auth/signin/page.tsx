import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SignInPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col items-center justify-center">
				<div className="container-card w-full max-w-md space-y-8">
					<div className="text-center">
						<div className="flex justify-center">
							<Image
								src="/brand/f1-penca-logo.svg"
								alt="F1 Penca Logo"
								width={80}
								height={42}
								className="logo-accent-red"
							/>{" "}
						</div>
						<h2 className="mt-8 text-2xl font-bold tracking-tight">F1 Penca</h2>
						<p className="mt-2 text-gray-400">Lights out and away we go!</p>
					</div>

					<div className="mt-8 space-y-6">
						<div className="space-y-4">
							<GoogleSignInButton />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
			<main className="flex flex-col items-center gap-8 max-w-2xl text-center">
				<h1 className="text-4xl font-bold text-gray-100">F1 Penca</h1>
				<p className="text-xl text-gray-400 mb-4">
					Predict F1 race results and compete with your friends
				</p>

				<div className="flex gap-4 flex-col sm:flex-row">
					<a href="/auth/signin" className="btn btn-md btn-shadow text-center">
						Get Started
					</a>
					<a href="/about" className="btn btn-md btn-outline text-center">
						About the Project
					</a>
				</div>
			</main>
		</div>
	);
}

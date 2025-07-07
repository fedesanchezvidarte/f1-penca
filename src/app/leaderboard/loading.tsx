"use client";

import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Skeleton,
} from "@heroui/react";

export default function Loading() {
	return (
		<div className="container mx-auto px-4 py-8 text-gray-100">
			<h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
				Leaderboard
			</h1>
			<div className="max-w-3xl mx-auto bg-black/20 border-line">
				<Table
					aria-label="Loading leaderboard"
					className="max-h-[80vh] overflow-y-auto"
					classNames={{
						wrapper: "bg-black/20",
						th: "bg-gray-800 text-gray-400 font-semibold",
						td: "text-gray-100",
					}}
				>
					<TableHeader>
						<TableColumn>Position</TableColumn>
						<TableColumn>User</TableColumn>
						<TableColumn>Points</TableColumn>
					</TableHeader>
					<TableBody>
						{Array(10)
							.fill(0)
							.map((_, index) => (
								<TableRow key={index}>
									<TableCell className="py-2.5">
										<Skeleton className="w-8 h-4 rounded-lg" />
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex items-center space-x-3">
											<Skeleton className="w-8 h-8 rounded-full" />
											<Skeleton className="w-24 h-4 rounded-lg" />
										</div>
									</TableCell>
									<TableCell className="py-2.5">
										<Skeleton className="w-12 h-4 rounded-lg" />
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<div className="bg-black/20 flex justify-center pb-4">
					<Skeleton className="w-60 h-8 rounded-lg" />
				</div>
			</div>
		</div>
	);
}

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
		<div className="container mx-auto px-4 py-8 text-foreground">
			<h1 className="text-3xl font-bold mb-6 text-center text-foreground">
				Leaderboard
			</h1>
			<div className="max-w-3xl mx-auto">
				<Table
					aria-label="Loading leaderboard"
					className="max-h-[80vh] overflow-y-auto"
					classNames={{
						wrapper: "card-racing-translucent",
						th: "bg-content2/70 text-muted font-semibold border-b border-default-200",
						td: "text-foreground border-b border-default-100/50",
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
										<Skeleton className="w-8 h-4 rounded-lg bg-default-300/30" />
									</TableCell>
									<TableCell className="py-2.5">
										<div className="flex items-center space-x-3">
											<Skeleton className="w-8 h-8 rounded-full bg-default-300/30" />
											<Skeleton className="w-24 h-4 rounded-lg bg-default-300/30" />
										</div>
									</TableCell>
									<TableCell className="py-2.5">
										<Skeleton className="w-12 h-4 rounded-lg bg-default-300/30" />
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

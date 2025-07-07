"use client";

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Pagination } from "@heroui/react";

interface Standing {
    id: string;
    name: string | null;
    image: string | null;
    totalPoints: number;
}

interface LeaderboardTableProps {
    standings: Standing[];
}

export default function LeaderboardTable({ standings }: LeaderboardTableProps) {
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    // Calculate pagination values
    const pages = Math.ceil((standings?.length || 0) / rowsPerPage);

    const items = React.useMemo(() => {
        if (!standings || standings.length === 0) return [];
        
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return standings.slice(start, end);
    }, [page, standings]);

    // Handle empty data case
    if (!standings || standings.length === 0) {
        return (
            <div className="max-w-3xl mx-auto">
                <Table
                    aria-label="Empty leaderboard table"
                    className="max-h-[80vh] overflow-y-auto"
                    classNames={{
                        wrapper: "bg-black/20 border-line",
                        th: "bg-gray-800 text-gray-400 font-semibold",
                        td: "text-gray-100",
                    }}
                >
                    <TableHeader>
                        <TableColumn>Position</TableColumn>
                        <TableColumn>User</TableColumn>
                        <TableColumn>Points</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No standings data available">
                        {[]}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Table
                aria-label="Leaderboard table"
                className="max-h-[80vh] overflow-y-auto"
                bottomContent={
                    pages > 1 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="danger"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                                classNames={{
                                    wrapper: "gap-0 overflow-visible h-8 rounded border border-gray-700 bg-gray-900",
                                    item: "w-8 h-8 text-small rounded-none bg-transparent text-gray-400 hover:bg-gray-800",
                                    cursor: "btn-red-gradient shadow-lg text-white font-bold",
                                    prev: "bg-transparent text-gray-400 hover:bg-gray-800 border-r border-gray-700",
                                    next: "bg-transparent text-gray-400 hover:bg-gray-800 border-l border-gray-700",
                                }}
                            />
                        </div>
                    ) : null
                }
                classNames={{
                    wrapper: "bg-black/20 border-line",
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
                    {items.map((user, index) => {
                        const globalIndex = (page - 1) * rowsPerPage + index;
                        return (
                            <TableRow key={user.id}>
                                <TableCell>{globalIndex + 1}</TableCell>
                                <TableCell>
                                    <User
                                        avatarProps={{
                                            src: user.image || undefined,
                                            size: "sm",
                                        }}
                                        name={user.name || 'User'}
                                        classNames={{
                                            name: "text-gray-100",
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-bold text-white">{user.totalPoints}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

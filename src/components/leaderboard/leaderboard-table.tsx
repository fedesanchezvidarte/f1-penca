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
                        wrapper: "card-racing-translucent",
                        th: "bg-content2 text-muted font-semibold",
                        td: "text-foreground",
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
                                color="primary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                                classNames={{
                                    wrapper: "gap-0 overflow-visible h-8 rounded border-themed bg-content2",
                                    item: "w-8 h-8 text-small rounded-none bg-transparent text-muted hover:bg-content3",
                                    cursor: "btn-f1-red shadow-lg text-white font-bold",
                                    prev: "bg-transparent text-muted hover:bg-content3 border-r border-divider",
                                    next: "bg-transparent text-muted hover:bg-content3 border-l border-divider",
                                }}
                            />
                        </div>
                    ) : null
                }
                classNames={{
                    wrapper: "card-racing-translucent",
                    th: "bg-content2 text-muted font-semibold",
                    td: "text-foreground",
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
                                            name: "text-foreground",
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-bold text-emphasis">{user.totalPoints}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

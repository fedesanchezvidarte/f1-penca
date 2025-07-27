"use client";

import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { Race } from "@/services/races";

interface RaceCardProps {
    race: Race;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
    });
}

function getStatusColor(status: string): "success" | "warning" | "default" {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'LIVE':
            return 'warning';
        case 'UPCOMING':
            return 'default';
        default:
            return 'default';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'COMPLETED':
            return 'Completed';
        case 'LIVE':
            return 'Live';
        case 'UPCOMING':
            return 'Upcoming';
        default:
            return status;
    }
}

export default function RaceCard({ race }: RaceCardProps) {
    return (
        <Card className="w-full h-32 hover:scale-105 transition-transform duration-200 bg-content1 border border-divider hover:border-primary/50 hover:shadow-lg">
            <CardBody className="p-4 flex flex-row justify-between items-start h-full">
                {/* Left side content */}
                <div className="flex flex-col justify-between h-full flex-1">
                    {/* Top left - Round and Race name */}
                    <div>
                        <p className="text-xs text-default-500 font-medium mb-1">
                            ROUND {race.round}
                        </p>
                        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                            {race.name}
                        </h3>
                    </div>
                    
                    {/* Bottom left - Date */}
                    <div>
                        <p className="text-xs text-default-600 font-medium">
                            {formatDate(race.date)}
                        </p>
                    </div>
                </div>

                {/* Right side content */}
                <div className="flex flex-col items-center justify-between h-full ml-4">
                    {/* Points container */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-content2 to-content3 rounded-lg px-3 py-2 min-w-[60px] border border-divider">
                        <p className="text-xs text-default-500 uppercase tracking-wider font-semibold">
                            POINTS
                        </p>
                        <p className="text-2xl font-bold text-primary leading-none">
                            {race.userPoints || 0}
                        </p>
                    </div>
                    
                    {/* Status badge */}
                    <Chip 
                        color={getStatusColor(race.status)}
                        size="sm" 
                        variant="flat"
                        className="mt-2 font-medium"
                    >
                        {getStatusText(race.status)}
                    </Chip>
                </div>
            </CardBody>
        </Card>
    );
}

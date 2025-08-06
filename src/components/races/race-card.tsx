"use client";

import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
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

function getStatusColor(status: string): "success" | "primary" | "default" {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'LIVE':
            return 'primary';
        case 'UPCOMING':
            return 'default';
        default:
            return 'default';
    }
}

function getStatusVariant(status: string): "flat" | "shadow" {
    switch (status) {
        case 'LIVE':
            return 'shadow';
        default:
            return 'flat';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'COMPLETED':
            return 'Completed';
        case 'LIVE':
            return 'LIVE';
        case 'UPCOMING':
            return 'Upcoming';
        default:
            return status;
    }
}

export default function RaceCard({ race }: RaceCardProps) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Clicking race card with ID:', race.id);
        console.log('Navigating to:', `/races/${race.id}`);
        router.push(`/races/${race.id}`);
    };

    return (
        <div 
            className="cursor-pointer"
            onClick={handleCardClick}
        >
            <Card 
                className="w-full h-32 hover:scale-105 transition-transform duration-200 card-racing-translucent hover:border-primary/50 hover:shadow-lg"
            >
            <CardBody className="p-4 flex flex-row justify-between items-start h-full">
                {/* Left side content */}
                <div className="flex flex-col justify-between h-full flex-1">
                    {/* Top left - Round and Race name */}
                    <div>
                        <p className="text-xs text-muted font-medium mb-1">
                            ROUND {race.round}
                        </p>
                        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                            {race.name}
                        </h3>
                    </div>
                    
                    {/* Bottom left - Date */}
                    <div>
                        <p className="text-xs race-date">
                            {formatDate(race.date)}
                        </p>
                    </div>
                </div>

                {/* Right side content */}
                <div className="flex-center-col justify-between h-full ml-4">
                    {/* Points container */}
                    <div className="flex-center-col bg-gradient-to-br from-content2 to-content3 rounded-lg px-3 py-2 min-w-[60px] border border-default-700/50 shadow-lg">
                        <p className="text-xs text-white uppercase tracking-wider font-semibold">
                            POINTS
                        </p>
                        <p className="text-3xl font-bold text-primary leading-none">
                            {race.userPoints || 0}
                        </p>
                    </div>
                    
                    {/* Status badge */}
                    <Chip 
                        color={getStatusColor(race.status)}
                        size="sm" 
                        variant={getStatusVariant(race.status)}
                        className="mt-2 status-badge"
                    >
                        {getStatusText(race.status)}
                    </Chip>
                </div>
            </CardBody>
        </Card>
        </div>
    );
}

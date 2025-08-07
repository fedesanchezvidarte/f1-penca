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
            return '⚪ LIVE';
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

    // Format points for countdown-style display
    const points = race.userPoints || 0;

    return (
        <div 
            className="cursor-pointer p-1"
            onClick={handleCardClick}
            id={`race-card-${race.id}`}
        >
            <Card 
                className="w-full h-34 hover:scale-[1.02] transition-transform duration-200 card-racing-translucent hover:border-primary/50 hover:shadow-lg"
                id={`race-card-content-${race.id}`}
            >
            <CardBody className="p-4 flex flex-row justify-between items-start h-full">
                {/* Left side content */}
                <div className="flex flex-col justify-between h-full flex-1 mr-6" id={`race-info-${race.id}`}>
                    {/* Top left - Round and Race name */}
                    <div id={`race-header-${race.id}`}>
                        <p className="text-xs text-muted font-medium mb-1" id={`race-round-${race.id}`}>
                            ROUND {race.round}
                        </p>
                        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2" id={`race-name-${race.id}`}>
                            {race.name}
                        </h3>
                    </div>
                    
                    {/* Bottom left - Date */}
                    <div id={`race-date-container-${race.id}`}>
                        <p className="text-xs race-date" id={`race-date-${race.id}`}>
                            {formatDate(race.date)}
                        </p>
                    </div>
                </div>

                {/* Right side content */}
                <div className="flex-center-col justify-between h-full" id={`race-status-points-${race.id}`}>
                    {/* Points container - Single box countdown style */}
                    <div className="flex-center-col" id={`points-section-${race.id}`}>
                        <p className="text-xs text-default-500 font-medium mb-1 uppercase tracking-wider" id={`points-label-${race.id}`}>
                            POINTS
                        </p>
                        <div className="border border-divider rounded p-2 w-[60px] flex items-center justify-center" id={`points-display-${race.id}`}>
                            <span className="text-2xl font-mono font-bold text-foreground">
                                {points}
                            </span>
                        </div>
                    </div>
                    
                    {/* Status badge */}
                    <Chip 
                        color={getStatusColor(race.status)}
                        size="sm" 
                        variant={getStatusVariant(race.status)}
                        className="mt-2 status-badge"
                        id={`race-status-badge-${race.id}`}
                    >
                        {getStatusText(race.status)}
                    </Chip>
                </div>
            </CardBody>
        </Card>
        </div>
    );
}

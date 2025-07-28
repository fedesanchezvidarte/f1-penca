"use client";

import React from "react";
import { Card, CardBody, Button, Chip, InputOtp } from "@heroui/react";
import { Race } from "@/services/races";
import { Prediction } from "@/services/predictions";

interface RaceOverviewProps {
    race: Race;
    prediction: Prediction | null;
    onPredictionUpdate: (prediction: Prediction) => void;
    onNavigateBack?: () => void;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric',
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
            return 'LIVE';
        case 'UPCOMING':
            return 'Upcoming';
        default:
            return status;
    }
}

function getButtonText(status: string, prediction: Prediction | null): string {
    if (status === 'COMPLETED') {
        return 'Finished';
    }
    
    if (status === 'LIVE') {
        return 'Predictions Closed';
    }

    if (prediction) {
        return 'Prediction Complete';
    }

    return 'Prediction Open';
}

function getButtonColor(status: string, prediction: Prediction | null): "primary" | "success" | "secondary" | "default" {
    if (status === 'COMPLETED' || status === 'LIVE') {
        return 'primary';
    }
    
    if (prediction) {
        return 'secondary';
    }

    return 'success';
}

function getButtonVariant(status: string): "solid" | "flat" | "shadow" {
    if (status === 'COMPLETED') {
        return 'flat';
    } else if (status === 'LIVE') {
        return 'solid';
    }
    
    return 'shadow';
}

export default function RaceOverview({ race, prediction, onNavigateBack }: RaceOverviewProps) {
    const isDisabled = race.status === 'COMPLETED' || race.status === 'LIVE';
    
    // Convert points to string and pad to ensure we have enough digits
    const pointsString = (prediction?.totalPoints ?? 0).toString().padStart(3, '0');
    
    return (
        <div className="space-y-4">
            {/* Race Overview Card */}
            <Card className="w-full card-racing-translucent">
                <CardBody className="p-6">
                    {/* Race Information */}
                    <div className="mb-6">
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-sm text-default-500 font-medium">
                                    ROUND {race.round}
                                </p>
                                {/* Back Navigation */}
                                {onNavigateBack && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onPress={onNavigateBack}
                                        startContent={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        }
                                    >
                                    </Button>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">
                                {race.name}
                            </h2>
                            <p className="text-default-600 font-medium">
                                {formatDate(race.date)}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                            <Chip 
                                color={getStatusColor(race.status)}
                                size="sm" 
                                variant="flat"
                                className="font-medium"
                            >
                                {getStatusText(race.status)}
                            </Chip>
                        </div>

                        {/* Weekend Type Badge */}
                        <div className="mb-4">
                            <Chip 
                                color={race.hasSprint ? "danger" : "secondary"}
                                size="sm" 
                                variant="flat"
                                className="font-medium"
                            >
                                {race.hasSprint ? "Sprint Weekend" : "Regular Weekend"}
                            </Chip>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center">
                        <Button
                            color={getButtonColor(race.status, prediction)}
                            variant={getButtonVariant(race.status)}
                            size="lg"
                            className="w-full font-semibold cursor-default"
                            isDisabled={isDisabled}
                        >
                            {getButtonText(race.status, prediction)}
                        </Button>

                        {prediction && race.status === 'UPCOMING' && (
                            <p className="text-xs text-default-500 mt-5 text-center">
                                You can edit your prediction until the session starts
                            </p>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Points Card */}
            <Card className="w-full card-racing-translucent">
                <CardBody className="p-4">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <InputOtp
                            length={pointsString.length}
                            size="lg"
                            radius="lg"
                            color="default"
                            variant="underlined"
                            value={pointsString}
                            isReadOnly
                            className="pointer-events-none"
                        />
                        <p className="text-md font-semibold text-foreground">Your Points</p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

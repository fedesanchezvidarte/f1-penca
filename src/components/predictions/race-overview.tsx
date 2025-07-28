"use client";

import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Race } from "@/services/races";
import { Prediction } from "@/services/predictions";

interface RaceOverviewProps {
    race: Race;
    prediction: Prediction | null;
    onPredictionUpdate: (prediction: Prediction) => void;
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
        return 'Edit Prediction';
    }

    return 'Create Prediction';
}

function getButtonVariant(status: string, prediction: Prediction | null): "solid" | "bordered" | "flat" {
    if (status === 'COMPLETED' || status === 'LIVE') {
        return 'flat';
    }
    
    return prediction ? 'bordered' : 'solid';
}

export default function RaceOverview({ race, prediction }: RaceOverviewProps) {
    const isDisabled = race.status === 'COMPLETED' || race.status === 'LIVE';
    
    return (
        <Card className="w-full card-racing-translucent">
            <CardBody className="p-6">
                {/* Race Information */}
                <div className="mb-6">
                    <div className="mb-4">
                        <p className="text-sm text-default-500 font-medium mb-2">
                            ROUND {race.round}
                        </p>
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
                        color="primary"
                        variant={getButtonVariant(race.status, prediction)}
                        size="lg"
                        className="w-full font-semibold"
                        isDisabled={isDisabled}
                    >
                        {getButtonText(race.status, prediction)}
                    </Button>

                    {prediction && race.status === 'UPCOMING' && (
                        <p className="text-xs text-default-500 mt-2 text-center">
                            You can edit your prediction until the race starts
                        </p>
                    )}

                    {prediction && prediction.totalPoints !== undefined && race.status === 'COMPLETED' && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-default-600 mb-1">Your Points</p>
                            <p className="text-2xl font-bold text-primary">
                                {prediction.totalPoints}
                            </p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}

"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Chip, InputOtp, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Race } from "@/services/races";
import { Prediction } from "@/services/predictions";
import CountdownTimer from "@/components/ui/countdown-timer";

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

function getStatusColor(status: string): "success" | "warning" | "default" | "primary" {
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
    const [showPointSystemModal, setShowPointSystemModal] = useState(false);
    
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
                            <div className="flex-between items-start mb-2">
                                <p className="round-label">
                                    ROUND {race.round}
                                </p>
                                {/* Back Navigation - Return to Races */}
                                {onNavigateBack && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onPress={onNavigateBack}
                                        startContent={
                                            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        }
                                    >
                                    </Button>
                                )}
                            </div>
                            <h2 className="race-title">
                                {race.name}
                            </h2>
                            <p className="race-date">
                                {formatDate(race.date)}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                            <Chip 
                                color={getStatusColor(race.status)}
                                size="sm" 
                                variant={getStatusVariant(race.status)}
                                className="status-badge"
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
                                className="status-badge"
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
                            className="action-button-full"
                            isDisabled={isDisabled}
                        >
                            {getButtonText(race.status, prediction)}
                        </Button>

                        {prediction && race.status === 'UPCOMING' && race.deadline && (
                            <div className="flex-center space-x-3 mt-5">
                                <svg className="clock-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <CountdownTimer 
                                    deadline={race.deadline} 
                                    hasSprint={race.hasSprint}
                                    compact={true}
                                />
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Points Card */}
            <Card className="w-full card-racing-translucent">
                <CardBody className="p-4">
                    <div className="points-container">
                        {/* Left side - Points display */}
                        <div className="points-display">
                            <InputOtp
                                length={pointsString.length}
                                size="lg"
                                color="default"
                                variant="underlined"
                                value={pointsString}
                                isReadOnly
                                className="pointer-events-none"
                            />
                            <p className="points-label">Your Points</p>
                        </div>
                        
                        {/* Divider */}
                        <div className="points-divider"></div>
                        
                        {/* Right side - Navigation buttons */}
                        <div className="points-buttons">
                            <Button
                                variant="ghost"
                                size="sm"
                                onPress={() => window.location.href = '/leaderboard'}
                                startContent={
                                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                            >
                                Leaderboard
                            </Button>
                            <Button
                                variant="flat"
                                size="sm"
                                color="secondary"
                                onPress={() => setShowPointSystemModal(true)}
                                startContent={
                                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            >
                                Point System
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Point System Modal */}
            <Modal 
                backdrop="blur"
                isOpen={showPointSystemModal} 
                onOpenChange={setShowPointSystemModal}
                size="2xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                F1 Penca Point System
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-6">
                                    {/* Regular Weekend Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-primary">Regular Weekend</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-divider">
                                                        <th className="text-left p-2 font-medium">Category</th>
                                                        <th className="text-center p-2 font-medium">Exact Match</th>
                                                        <th className="text-center p-2 font-medium">Partial</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Pole Position</td>
                                                        <td className="p-2 text-center font-semibold text-success">10 pts</td>
                                                        <td className="p-2 text-center">-</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Race Winner</td>
                                                        <td className="p-2 text-center font-semibold text-success">15 pts</td>
                                                        <td className="p-2 text-center">-</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">2nd Place</td>
                                                        <td className="p-2 text-center font-semibold text-success">10 pts</td>
                                                        <td className="p-2 text-center text-warning">5 pts (podium)</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">3rd Place</td>
                                                        <td className="p-2 text-center font-semibold text-success">8 pts</td>
                                                        <td className="p-2 text-center text-warning">3 pts (podium)</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">4th Place</td>
                                                        <td className="p-2 text-center font-semibold text-success">6 pts</td>
                                                        <td className="p-2 text-center text-warning">1 pt (top 5)</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">5th Place</td>
                                                        <td className="p-2 text-center font-semibold text-success">4 pts</td>
                                                        <td className="p-2 text-center text-warning">1 pt (top 5)</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Sprint Weekend Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-danger">Sprint Weekend (Additional Points)</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-divider">
                                                        <th className="text-left p-2 font-medium">Category</th>
                                                        <th className="text-center p-2 font-medium">Exact Match</th>
                                                        <th className="text-center p-2 font-medium">Partial</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Sprint Pole</td>
                                                        <td className="p-2 text-center font-semibold text-success">5 pts</td>
                                                        <td className="p-2 text-center">-</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Sprint Winner</td>
                                                        <td className="p-2 text-center font-semibold text-success">8 pts</td>
                                                        <td className="p-2 text-center">-</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Sprint 2nd</td>
                                                        <td className="p-2 text-center font-semibold text-success">5 pts</td>
                                                        <td className="p-2 text-center text-warning">3 pts</td>
                                                    </tr>
                                                    <tr className="border-b border-divider">
                                                        <td className="p-2">Sprint 3rd</td>
                                                        <td className="p-2 text-center font-semibold text-success">3 pts</td>
                                                        <td className="p-2 text-center text-warning">1 pt</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Bonuses Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-secondary">Bonus Points</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-success-50 dark:bg-success-100/10 p-3 rounded-lg">
                                                <p className="font-semibold text-success">Perfect Podium</p>
                                                <p className="text-sm text-default-600">+10 pts for exact podium order</p>
                                            </div>
                                            <div className="bg-success-50 dark:bg-success-100/10 p-3 rounded-lg">
                                                <p className="font-semibold text-success">Perfect Top 5</p>
                                                <p className="text-sm text-default-600">+10 pts for exact top 5 order</p>
                                            </div>
                                            <div className="bg-warning-50 dark:bg-warning-100/10 p-3 rounded-lg">
                                                <p className="font-semibold text-warning">Perfect Sprint Podium</p>
                                                <p className="text-sm text-default-600">+5 pts for exact sprint podium</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Maximum Score Section */}
                                    <div className="bg-primary-50 dark:bg-primary-100/10 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold mb-2 text-primary">Maximum Possible Score</h3>
                                        <div className="flex justify-around text-center">
                                            <div>
                                                <p className="text-2xl font-bold text-primary">74</p>
                                                <p className="text-sm text-default-600">Regular Weekend</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-danger">100</p>
                                                <p className="text-sm text-default-600">Sprint Weekend</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Got it!
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

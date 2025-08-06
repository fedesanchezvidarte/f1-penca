"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@heroui/react";

interface CountdownTimerProps {
    deadline: string;
    hasSprint?: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

function calculateTimeLeft(deadline: string): TimeLeft {
    const now = new Date().getTime();
    const targetTime = new Date(deadline).getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true
        };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false
    };
}

export default function CountdownTimer({ deadline, hasSprint = false }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadline));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(deadline));
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft.isExpired) {
        return (
            <Card className="w-full card-racing-translucent">
                <CardBody className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-danger" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-lg font-semibold text-danger">Predictions Closed</span>
                        </div>
                        <p className="text-sm text-default-500 text-center">
                            The deadline for predictions has passed
                        </p>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full card-racing-translucent">
            <CardBody className="p-4">
                <div className="flex justify-between items-center">
                    {/* Left side - Countdown display */}
                    <div className="flex flex-col items-center justify-center space-y-2 ml-4">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="border border-divider rounded-lg p-2 min-w-[45px] flex items-center justify-center">
                                <span className="text-md font-bold text-foreground">
                                    {timeLeft.days.toString().padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="border border-divider rounded-lg p-2 min-w-[45px] flex items-center justify-center">
                                <span className="text-md font-bold text-foreground">
                                    {timeLeft.hours.toString().padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="border border-divider rounded-lg p-2 min-w-[45px] flex items-center justify-center">
                                <span className="text-md font-bold text-foreground">
                                    {timeLeft.minutes.toString().padStart(2, '0')}
                                </span>
                            </div>
                            
                            <div className="border border-divider rounded-lg p-2 min-w-[45px] flex items-center justify-center">
                                <span className="text-md font-bold text-foreground">
                                    {timeLeft.seconds.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                        <p className="text-md font-semibold text-foreground">Predictions Close</p>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-px h-20 bg-divider"></div>
                    
                    {/* Right side - Info */}
                    <div className="flex flex-col space-y-2 mr-4 items-center">
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <Chip 
                                color={hasSprint ? "danger" : "secondary"}
                                size="sm" 
                                variant="flat"
                                className="font-medium"
                            >
                                {hasSprint ? "Sprint" : "Main"}
                            </Chip>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-default-500 leading-tight">
                                {new Date(deadline).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                            <p className="text-xs text-default-500 leading-tight">
                                {new Date(deadline).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
    deadline: string;
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

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadline));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(deadline));
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft.isExpired) {
        return <span className="text-xs text-default-500 font-medium">Predictions Closed</span>;
    }

    return (
        <div className="flex items-center space-x-2">
            <div className="grid grid-cols-4 gap-1">
                <div className="countdown-box">
                    <span className="countdown-number">
                        {timeLeft.days.toString().padStart(2, '0')}
                    </span>
                </div>
                
                <div className="countdown-box">
                    <span className="countdown-number">
                        {timeLeft.hours.toString().padStart(2, '0')}
                    </span>
                </div>
                
                <div className="countdown-box">
                    <span className="countdown-number">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                </div>
                
                <div className="countdown-box">
                    <span className="countdown-number">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                </div>
            </div>
            <span className="text-xs text-default-500 font-medium">until predictions close</span>
        </div>
    );
}

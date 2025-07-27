"use client";

import React from "react";
import RaceCard from "./race-card";
import { Race } from "@/services/races";

interface RacesGridProps {
    races: Race[];
}

export default function RacesGrid({ races }: RacesGridProps) {
    if (!races || races.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-default-500 text-lg">No races found</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-4">
                {races.map((race) => (
                    <RaceCard key={race.id} race={race} />
                ))}
            </div>
        </div>
    );
}

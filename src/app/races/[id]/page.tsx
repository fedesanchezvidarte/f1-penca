"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Race, getRaceById } from "@/services/races";
import { Driver, getActiveDrivers } from "@/services/drivers";
import { Prediction, getUserPrediction } from "@/services/predictions";
import RaceOverview from "@/components/predictions/race-overview";
import PredictionForm from "@/components/predictions/prediction-form";
import { useAuthModal } from "@/components/auth/auth-modal-context";

export default function RacePredictionPage() {
    const { data: session, status } = useSession();
    const { openModal } = useAuthModal();
    const params = useParams();
    const raceId = params.id as string;

    const [race, setRace] = useState<Race | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            openModal();
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch race data, drivers, and user prediction in parallel
                const [raceData, driversData, predictionData] = await Promise.allSettled([
                    getRaceById(raceId),
                    getActiveDrivers(),
                    getUserPrediction(raceId)
                ]);

                if (raceData.status === "fulfilled") {
                    setRace(raceData.value);
                } else {
                    throw new Error("Failed to fetch race data");
                }

                if (driversData.status === "fulfilled") {
                    setDrivers(driversData.value);
                } else {
                    throw new Error("Failed to fetch drivers");
                }

                if (predictionData.status === "fulfilled") {
                    setPrediction(predictionData.value);
                } else if (predictionData.reason?.message !== "Prediction not found") {
                    console.warn("Failed to fetch prediction:", predictionData.reason);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, status, raceId, openModal]);

    const handlePredictionUpdate = (updatedPrediction: Prediction) => {
        setPrediction(updatedPrediction);
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (!session) {
        return null; // Auth modal will be shown
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-danger mb-4">Error</h1>
                    <p className="text-default-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!race) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-default-600 mb-4">Race Not Found</h1>
                    <p className="text-default-500">The requested race could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">
                Race Prediction
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel - Race Overview */}
                <div className="lg:col-span-1">
                    <RaceOverview 
                        race={race} 
                        prediction={prediction}
                        onPredictionUpdate={handlePredictionUpdate}
                    />
                </div>

                {/* Right Panel - Prediction Form */}
                <div className="lg:col-span-2">
                    <PredictionForm 
                        race={race}
                        drivers={drivers}
                        prediction={prediction}
                        onPredictionUpdate={handlePredictionUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

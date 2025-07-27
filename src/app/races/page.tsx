"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RacesGrid from '@/components/races/races-grid';
import { getRacesWithUserPoints, Race } from '@/services/races';
import { Spinner } from '@heroui/react';

export default function RacesPage() {
    const { status } = useSession();
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRaces = async () => {
            if (status === 'loading') return; // Wait for session to load
            
            if (status === 'unauthenticated') {
                setError('Please sign in to view your race points');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const racesData = await getRacesWithUserPoints(2025);
                setRaces(racesData);
                setError(null);
            } catch (err) {
                console.error('Error fetching races:', err);
                setError('Failed to load races. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRaces();
    }, [status]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-foreground">
                <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Races</h1>
                <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" color="primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-foreground">
                <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Races</h1>
                <div className="flex justify-center items-center py-12">
                    <p className="text-danger text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-foreground">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Races</h1>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto races-scroll">
                <RacesGrid races={races} />
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/leaderboard/leaderboard-table';
import { getStandings } from '../../services/standings';
import { Spinner } from '@heroui/react';

interface Standing {
    id: string;
    name: string | null;
    image: string | null;
    totalPoints: number;
}

export default function LeaderboardPage() {
    const [standings, setStandings] = useState<Standing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                setLoading(true);
                const standingsData = await getStandings();
                setStandings(standingsData);
                setError(null);
            } catch (err) {
                console.error('Error fetching standings:', err);
                setError('Failed to load leaderboard. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-foreground">
                <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Leaderboard</h1>
                <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" color="primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-foreground">
                <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Leaderboard</h1>
                <div className="flex justify-center items-center py-12">
                    <p className="text-danger text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-foreground">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Leaderboard</h1>
            <LeaderboardTable standings={standings} />
        </div>
    );
}

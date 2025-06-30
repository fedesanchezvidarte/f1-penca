import { Suspense } from 'react';
import LeaderboardTable from '../../components/leaderboard/leaderboard-table';
import { getStandings } from '../../services/standings';

export default async function LeaderboardPage() {
    const standings = await getStandings();

    return (
        <div className="container mx-auto px-4 py-8 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Leaderboard</h1>
            <Suspense fallback={<p className="text-gray-400 text-center">Loading...</p>}>
                <LeaderboardTable standings={standings} />
            </Suspense>
        </div>
    );
}

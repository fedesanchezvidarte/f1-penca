import { Suspense } from 'react';
import LeaderboardTable from '../../components/leaderboard/leaderboard-table';
import { getStandings } from '../../services/standings';

export default async function LeaderboardPage() {
    const standings = await getStandings();

    return (
        <div className="container mx-auto px-4 py-8 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Leaderboard</h1>
            <Suspense fallback={
                <div className="overflow-x-auto rounded-xl max-w-3xl mx-auto">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <div className="w-full bg-gray-900 border border-gray-800 font-sans">
                            <div className="bg-gray-800 text-left text-gray-400 py-3 px-4 flex">
                                <div className="w-1/4 font-semibold">Position</div>
                                <div className="w-2/4 font-semibold">User</div>
                                <div className="w-1/4 font-semibold">Points</div>
                            </div>
                            {Array(5).fill(0).map((_, index) => (
                                <div key={index} className="border-b border-gray-800 flex items-center">
                                    <div className="py-3 px-4 w-1/4">
                                        <div className="h-5 bg-gray-800 animate-pulse rounded-md w-6"></div>
                                    </div>
                                    <div className="py-3 px-4 w-2/4 flex items-center">
                                        <div className="h-8 w-8 bg-gray-800 animate-pulse rounded-full mr-3"></div>
                                        <div className="h-5 bg-gray-800 animate-pulse rounded-md w-24"></div>
                                    </div>
                                    <div className="py-3 px-4 w-1/4">
                                        <div className="h-5 bg-gray-800 animate-pulse rounded-md w-10"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }>
                <LeaderboardTable standings={standings} />
            </Suspense>
        </div>
    );
}

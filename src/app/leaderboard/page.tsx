import LeaderboardTable from '../../components/leaderboard/leaderboard-table';
import { getStandings } from '../../services/standings';

export default async function LeaderboardPage() {
    const standings = await getStandings();

    return (
        <div className="container mx-auto px-4 py-8 text-foreground">
            <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Leaderboard</h1>
            <LeaderboardTable standings={standings} />
        </div>
    );
}

import Image from 'next/image';

interface Standing {
    id: string;
    name: string | null;
    image: string | null;
    totalPoints: number;
}

interface LeaderboardTableProps {
    standings: Standing[];
}

export default function LeaderboardTable({ standings }: LeaderboardTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl max-w-4xl mx-auto">
            <div className="max-h-[70vh] overflow-y-auto">
                <table className="min-w-full bg-gray-900 border border-gray-800 font-sans">
                    <thead className="sticky top-0 z-10 bg-gray-900">
                        <tr className="bg-gray-800 text-left text-gray-400">
                            <th className="py-3 px-4 font-semibold">Position</th>
                            <th className="py-3 px-4 font-semibold">User</th>
                            <th className="py-3 px-4 font-semibold">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((user, index) => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4 flex items-center">
                                    {user.image && (
                                        <Image
                                            src={user.image}
                                            alt={user.name || 'User'}
                                            width={32}
                                            height={32}
                                            className="rounded-full mr-3"
                                        />
                                    )}
                                    {user.name}
                                </td>
                                <td className="py-3 px-4 font-bold text-red-600">{user.totalPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// src/app/api/standings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/standings
 * Gets user rankings and points across all races or filtered by season
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const season = searchParams.get('season');

        // Define the season filter if provided
        const seasonFilter = season ? { season: parseInt(season, 10) } : {};

        // Get all users with their predictions for the specified season
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                predictions: {
                    where: {
                        race: {
                            ...seasonFilter,
                            status: 'COMPLETED', // Only count completed races
                        },
                    },
                    select: {
                        points: true,
                        race: {
                            select: {
                                id: true,
                                name: true,
                                round: true,
                                season: true,
                            },
                        },
                    },
                },
            },
        });

        // Calculate total points and race participation for each user
        const standings = users.map(user => {
            const totalPoints = user.predictions.reduce((sum, pred) => sum + pred.points, 0);
            const racesParticipated = user.predictions.length;
            
            // Calculate average points per race (if participated in any)
            const averagePoints = racesParticipated > 0 
                ? (totalPoints / racesParticipated) 
                : 0;
            
            return {
                userId: user.id,
                name: user.name,
                image: user.image,
                totalPoints,
                racesParticipated,
                averagePoints: parseFloat(averagePoints.toFixed(2)),
                // Include detailed race points for the top 5 races
                topRaces: user.predictions
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 5)
                    .map(pred => ({
                        raceId: pred.race.id,
                        raceName: pred.race.name,
                        round: pred.race.round,
                        season: pred.race.season,
                        points: pred.points,
                    })),
            };
        });

        // Sort by total points (descending)
        const sortedStandings = standings
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((user, index) => ({
                ...user,
                position: index + 1, // Add position in the standings
            }));

        return NextResponse.json(sortedStandings);
    } catch (error) {
        console.error('Error getting standings:', error);
        return NextResponse.json(
            { error: 'Error getting standings' },
            { status: 500 }
        );
    }
}

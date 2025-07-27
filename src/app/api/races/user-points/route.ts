// src/app/api/races/user-points/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/races/user-points
 * Gets all races with user points for the current logged-in user
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const season = searchParams.get('season');

        const whereClause = {
            ...(season && { season: parseInt(season, 10) }),
        };

        // Get races with user predictions and points
        const races = await prisma.race.findMany({
            where: whereClause,
            orderBy: [
                { season: 'desc' },
                { round: 'asc' },
            ],
            include: {
                predictions: {
                    where: {
                        userId: session.user.id,
                    },
                    select: {
                        points: true,
                    },
                },
            },
        });

        // Transform the data to include userPoints
        const racesWithUserPoints = races.map(race => ({
            id: race.id,
            name: race.name,
            round: race.round,
            circuit: race.circuit,
            date: race.date.toISOString(),
            season: race.season,
            status: race.status,
            resultsImported: race.resultsImported,
            userPoints: race.predictions[0]?.points || 0,
        }));

        return NextResponse.json(racesWithUserPoints);
    } catch (error) {
        console.error('Error fetching races with user points:', error);
        return NextResponse.json(
            { message: 'An error occurred while fetching races with user points.' },
            { status: 500 }
        );
    }
}

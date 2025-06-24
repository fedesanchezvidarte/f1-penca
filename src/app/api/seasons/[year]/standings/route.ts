// src/app/api/seasons/[year]/standings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/seasons/[year]/standings
 * Gets user rankings and points for a specific season
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { year: string } }
) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const year = parseInt(params.year, 10);
        
        // Validate year is a valid number
        if (isNaN(year)) {
            return NextResponse.json(
                { error: 'Invalid year format' },
                { status: 400 }
            );
        }

        // Check if the season exists
        const seasonExists = await prisma.race.findFirst({
            where: { season: year },
        });

        if (!seasonExists) {
            return NextResponse.json(
                { error: `No races found for season ${year}` },
                { status: 404 }
            );
        }

        // Get all completed races for this season
        const races = await prisma.race.findMany({
            where: {
                season: year,
                status: 'COMPLETED',
            },
            select: {
                id: true,
                name: true,
                round: true,
                date: true,
                circuit: true,
                resultsImported: true,
            },
            orderBy: {
                round: 'asc',
            },
        });

        // Get all users with their predictions for this season
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                predictions: {
                    where: {
                        race: {
                            season: year,
                            status: 'COMPLETED',
                        },
                    },
                    select: {
                        raceId: true,
                        points: true,
                    },
                },
            },
        });

        // Calculate season standings
        const standings = users.map(user => {
            // Calculate total points
            const totalPoints = user.predictions.reduce((sum, pred) => sum + pred.points, 0);
            
            // Create a map of points by race
            const pointsByRace = new Map(
                user.predictions.map(pred => [pred.raceId, pred.points])
            );
            
            // Create detailed race points
            const racePoints = races.map(race => ({
                raceId: race.id,
                raceName: race.name,
                round: race.round,
                points: pointsByRace.get(race.id) || 0,
                participated: pointsByRace.has(race.id),
            }));
            
            return {
                userId: user.id,
                name: user.name,
                image: user.image,
                totalPoints,
                racesParticipated: user.predictions.length,
                racePoints,
            };
        });

        // Sort by total points (descending)
        const sortedStandings = standings
            .filter(user => user.racesParticipated > 0) // Only include users who participated
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((user, index) => ({
                ...user,
                position: index + 1, // Add position in the standings
            }));

        // Include race information in the response
        const response = {
            season: year,
            races,
            standings: sortedStandings,
            totalRaces: races.length,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(`Error getting standings for season ${params.year}:`, error);
        return NextResponse.json(
            { error: `Error getting standings for season ${params.year}` },
            { status: 500 }
        );
    }
}

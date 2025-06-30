// src/app/api/races/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/races
 * Gets all races, optionally filtered by season or status
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
        const status = searchParams.get('status');

        const whereClause: {
            season?: number;
            status?: 'UPCOMING' | 'LIVE' | 'COMPLETED';
        } = {
            ...(season && { season: parseInt(season, 10) }),
            ...(status && ['UPCOMING', 'LIVE', 'COMPLETED'].includes(status) && { status: status as 'UPCOMING' | 'LIVE' | 'COMPLETED' }),
        };

        // Get races
        const races = await prisma.race.findMany({
            where: whereClause,
            orderBy: [
                { season: 'desc' },
                { round: 'asc' },
            ],
            include: {
                results: {
                    select: {
                        id: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json(races);
    } catch (error) {
        console.error('Error getting races:', error);
        return NextResponse.json(
            { error: 'Error getting races' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/races
 * Creates a new race (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin permissions required' },
                { status: 403 }
            );
        }

        const { name, round, circuit, date, season, status = 'UPCOMING' } = await request.json();

        // Validate data
        if (!name || !round || !circuit || !date || !season) {
            return NextResponse.json(
                { error: 'Invalid data. All fields are required' },
                { status: 400 }
            );
        }

        // Check if a race with the same round and season already exists
        const existingRace = await prisma.race.findFirst({
            where: {
                round,
                season,
            },
        });

        if (existingRace) {
            return NextResponse.json(
                { error: `A race already exists for round ${round} in season ${season}` },
                { status: 400 }
            );
        }
        // Create new race
        const race = await prisma.race.create({
            data: {
                name,
                round,
                circuit,
                date: new Date(date),
                season,
                status,
            },
        });

        return NextResponse.json(race);
    } catch (error) {
        console.error('Error creating race:', error);
        return NextResponse.json(
            { error: 'Error creating race' },
            { status: 500 }
        );
    }
}

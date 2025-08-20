// src/app/api/races/[id]/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateAndUpdateRacePoints } from '@/services/points-calculation';

/**
 * GET /api/races/[id]/results
 * Gets results for a specific race
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: raceId } = await params;

        // Get the race results
        const raceResult = await prisma.raceResult.findFirst({
            where: { raceId },
            include: {
                race: true,
            },
        });

        // Check if results exist
        if (!raceResult) {
            return NextResponse.json(
                { error: 'Race results not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(raceResult);
    } catch (error) {
        console.error('Error getting race results:', error);
        return NextResponse.json(
            { error: 'Error getting race results' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/races/[id]/results
 * Creates or updates results for a specific race (admin only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin permissions required' },
                { status: 403 }
            );
        }

        const { id: raceId } = await params;
        const requestData = await request.json();
        
        const {
            raceResult: raceResultData,
            polePosition,
            fastestLap,
            sprintResult,
            sprintPolePosition
        } = requestData;

        // Validate data - raceResult is required
        if (!raceResultData || !Array.isArray(raceResultData)) {
            return NextResponse.json(
                { error: 'Invalid data. raceResult (array) is required' },
                { status: 400 }
            );
        }

        // Verify the race exists
        const race = await prisma.race.findUnique({
            where: { id: raceId },
        });

        if (!race) {
            return NextResponse.json(
                { error: 'Race not found' },
                { status: 404 }
            );
        }

        // Find existing result
        const existingResult = await prisma.raceResult.findFirst({
            where: { raceId },
        });

        // Create or update race result
        let resultRecord;
        
        if (existingResult) {
            // Update existing result
            resultRecord = await prisma.raceResult.update({
                where: { id: existingResult.id },
                data: {
                    raceResult: raceResultData,
                    polePosition: polePosition || null,
                    fastestLap: fastestLap || null,
                    sprintResult: sprintResult || null,
                    sprintPolePosition: sprintPolePosition || null,
                    sprintRace: !!sprintResult,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Create new result
            resultRecord = await prisma.raceResult.create({
                data: {
                    raceId,
                    raceResult: raceResultData,
                    polePosition: polePosition || null,
                    fastestLap: fastestLap || null,
                    sprintResult: sprintResult || null,
                    sprintPolePosition: sprintPolePosition || null,
                    sprintRace: !!sprintResult,
                },
            });
        }

        // Update race status to COMPLETED and set resultsImported flag
        await prisma.race.update({
            where: { id: raceId },
            data: {
                status: 'COMPLETED',
                resultsImported: true,
            },
        });

        // Prepare race results data for points calculation
        const raceResultsForCalculation = {
            polePosition: polePosition || null,
            fastestLap: fastestLap || null,
            raceResult: raceResultData,
            sprintPolePosition: sprintPolePosition || null,
            sprintResult: sprintResult || null,
        };

        // Calculate and update points for all predictions related to this race
        await calculateAndUpdateRacePoints(raceId, raceResultsForCalculation);

        return NextResponse.json(resultRecord);
    } catch (error) {
        console.error('Error creating/updating race results:', error);
        return NextResponse.json(
            { error: 'Error creating/updating race results' },
            { status: 500 }
        );
    }
}

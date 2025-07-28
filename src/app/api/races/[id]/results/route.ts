// src/app/api/races/[id]/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
        const { raceResult: raceResultData } = await request.json();

        // Validate data
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
                    updatedAt: new Date(),
                },
            });
        } else {
            // Create new result
            resultRecord = await prisma.raceResult.create({
                data: {
                    raceId,
                    raceResult: raceResultData,
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

        // Calculate and update points for all predictions related to this race
        await calculatePredictionPoints(raceId, raceResultData);

        return NextResponse.json(resultRecord);
    } catch (error) {
        console.error('Error creating/updating race results:', error);
        return NextResponse.json(
            { error: 'Error creating/updating race results' },
            { status: 500 }
        );
    }
}

/**
 * Helper function to calculate points for predictions based on race results
 */
interface DriverPosition {
    id: string;
    [key: string]: string | number | boolean | object;
}

async function calculatePredictionPoints(raceId: string, actualPositions: DriverPosition[]) {
    try {
        // Get all predictions for this race
        const predictions = await prisma.prediction.findMany({
            where: { raceId },
        });

        // Calculate points for each prediction
        for (const prediction of predictions) {
            const predictedPositions = prediction.positions as DriverPosition[];
            
            // Simple scoring: 10 points for correct position, 5 for off by one, 2 for off by two
            let points = 0;
            
            for (let i = 0; i < Math.min(10, predictedPositions.length, actualPositions.length); i++) {
                const predictedDriverId = predictedPositions[i]?.id;
                
                if (!predictedDriverId) continue;
                
                // Find position of this driver in actual results
                const actualPosition = actualPositions.findIndex(driver => driver.id === predictedDriverId);
                
                if (actualPosition === i) {
                    // Correct position
                    points += 10;
                } else if (actualPosition === i - 1 || actualPosition === i + 1) {
                    // Off by one position
                    points += 5;
                } else if (actualPosition === i - 2 || actualPosition === i + 2) {
                    // Off by two positions
                    points += 2;
                }
            }
            
            // Update prediction with points
            await prisma.prediction.update({
                where: { id: prediction.id },
                data: { points },
            });
        }
    } catch (error) {
        console.error('Error calculating prediction points:', error);
    }
}

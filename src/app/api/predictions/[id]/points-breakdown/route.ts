import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPredictionPointsBreakdown } from '@/services/points-calculation';

/**
 * GET /api/predictions/[id]/points-breakdown
 * Get detailed points breakdown for a specific prediction
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: predictionId } = await params;

        // Get the prediction with race results
        const prediction = await prisma.prediction.findUnique({
            where: { id: predictionId },
            include: {
                race: {
                    include: {
                        results: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!prediction) {
            return NextResponse.json(
                { error: 'Prediction not found' },
                { status: 404 }
            );
        }

        // Check if user owns this prediction or is admin
        if (prediction.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden. You can only view your own predictions' },
                { status: 403 }
            );
        }

        // Check if race has results
        if (!prediction.race.results || prediction.race.results.length === 0) {
            return NextResponse.json(
                { error: 'Race results not available yet' },
                { status: 404 }
            );
        }

        const raceResult = prediction.race.results[0];

        // Transform prediction data for the breakdown function
        const predictionData = {
            id: prediction.id,
            userId: prediction.userId,
            positions: prediction.positions as string[],
            polePositionPrediction: prediction.polePositionPrediction,
            fastestLapPrediction: prediction.fastestLapPrediction,
            sprintPositions: prediction.sprintPositions as string[] | null,
            sprintPolePrediction: prediction.sprintPolePrediction,
        };

        // Transform race results data
        const raceResults = {
            polePosition: raceResult.polePosition,
            fastestLap: raceResult.fastestLap,
            raceResult: raceResult.raceResult as Array<{ driverId: string; position: number }>,
            sprintPolePosition: raceResult.sprintPolePosition,
            sprintResult: raceResult.sprintResult as Array<{ driverId: string; position: number }> | undefined,
        };

        // Get detailed points breakdown
        const breakdown = getPredictionPointsBreakdown(predictionData, raceResults);

        return NextResponse.json({
            prediction: {
                id: prediction.id,
                user: prediction.user,
                race: {
                    id: prediction.race.id,
                    name: prediction.race.name,
                    round: prediction.race.round,
                },
                totalPoints: prediction.points,
            },
            pointsBreakdown: breakdown,
            calculatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error getting prediction points breakdown:', error);
        return NextResponse.json(
            { error: 'Failed to get points breakdown' },
            { status: 500 }
        );
    }
}

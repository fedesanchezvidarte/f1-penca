import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/predictions/[id] - Get user prediction for a race
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: raceId } = await params;

        const prediction = await prisma.prediction.findFirst({
            where: {
                raceId,
                userId: session.user.id,
            },
            select: {
                id: true,
                raceId: true,
                polePositionPrediction: true,
                positions: true,
                fastestLapPrediction: true,
                sprintPositions: true,
                sprintPolePrediction: true,
                points: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!prediction) {
            return NextResponse.json(null, { status: 404 });
        }

        // Transform the data to match our interface
        const positions = prediction.positions as string[];
        const sprintPositions = prediction.sprintPositions as string[] | null;

        const formattedPrediction = {
            id: prediction.id,
            raceId: prediction.raceId,
            polePosition: prediction.polePositionPrediction || '',
            fastestLap: prediction.fastestLapPrediction || '',
            raceWinner: positions[0] || '',
            secondPlace: positions[1] || '',
            thirdPlace: positions[2] || '',
            fourthPlace: positions[3] || '',
            fifthPlace: positions[4] || '',
            sprintPole: prediction.sprintPolePrediction || '',
            sprintWinner: sprintPositions?.[0] || '',
            sprintSecond: sprintPositions?.[1] || '',
            sprintThird: sprintPositions?.[2] || '',
            totalPoints: prediction.points,
            createdAt: prediction.createdAt,
            updatedAt: prediction.updatedAt,
        };

        return NextResponse.json(formattedPrediction);
    } catch (error) {
        console.error('Error fetching prediction:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prediction' },
            { status: 500 }
        );
    }
}

// PUT /api/predictions/[id] - Update user prediction for a race
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: raceId } = await params;
        const body = await request.json();

        // Validate required fields for main race predictions
        if (!body.polePositionPrediction || !body.fastestLapPrediction || !body.positions || !Array.isArray(body.positions) || body.positions.length !== 5) {
            return NextResponse.json(
                { error: 'All main race predictions are required: pole position, fastest lap, and 5 race positions' },
                { status: 400 }
            );
        }

        // Check for empty values in positions array
        if (body.positions.some((pos: string) => !pos || pos.trim() === '')) {
            return NextResponse.json(
                { error: 'All race positions must be filled (1st through 5th place)' },
                { status: 400 }
            );
        }

        // Check if this is a sprint weekend race
        const raceInfo = await prisma.race.findUnique({
            where: { id: raceId },
            select: { status: true, hasSprint: true },
        });

        if (!raceInfo) {
            return NextResponse.json({ error: 'Race not found' }, { status: 404 });
        }

        if (raceInfo.status !== 'UPCOMING') {
            return NextResponse.json(
                { error: 'Predictions are closed for this race' },
                { status: 400 }
            );
        }

        // For sprint weekends, validate that all sprint fields are provided
        if (raceInfo.hasSprint) {
            if (!body.sprintPolePrediction || !body.sprintPositions || !Array.isArray(body.sprintPositions) || body.sprintPositions.length !== 3) {
                return NextResponse.json(
                    { error: 'For sprint weekends, all sprint predictions are required (sprint pole + 3 sprint positions)' },
                    { status: 400 }
                );
            }

            if (body.sprintPositions.some((pos: string) => !pos || pos.trim() === '')) {
                return NextResponse.json(
                    { error: 'All sprint positions must be filled for sprint weekends' },
                    { status: 400 }
                );
            }
        }

        // Get positions from the request body (frontend sends this format)
        const positions = body.positions;
        const sprintPositions = body.sprintPositions || undefined;

        const updatedPrediction = await prisma.prediction.updateMany({
            where: {
                raceId,
                userId: session.user.id,
            },
            data: {
                polePositionPrediction: body.polePositionPrediction,
                positions: positions,
                fastestLapPrediction: body.fastestLapPrediction,
                sprintPositions: sprintPositions,
                sprintPolePrediction: body.sprintPolePrediction || null,
                updatedAt: new Date(),
            },
        });

        if (updatedPrediction.count === 0) {
            return NextResponse.json(
                { error: 'Prediction not found' },
                { status: 404 }
            );
        }

        // Fetch the updated prediction to return complete data
        const prediction = await prisma.prediction.findFirst({
            where: {
                raceId,
                userId: session.user.id,
            },
            select: {
                id: true,
                raceId: true,
                userId: true,
                polePositionPrediction: true,
                positions: true,
                fastestLapPrediction: true,
                sprintPositions: true,
                sprintPolePrediction: true,
                points: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!prediction) {
            return NextResponse.json(
                { error: 'Prediction not found after update' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: prediction.id,
            raceId: prediction.raceId,
            userId: prediction.userId,
            polePositionPrediction: prediction.polePositionPrediction,
            positions: prediction.positions,
            fastestLapPrediction: prediction.fastestLapPrediction,
            sprintPositions: prediction.sprintPositions,
            sprintPolePrediction: prediction.sprintPolePrediction,
            points: prediction.points,
            createdAt: prediction.createdAt,
            updatedAt: prediction.updatedAt,
        });
    } catch (error) {
        console.error('Error updating prediction:', error);
        return NextResponse.json(
            { error: 'Failed to update prediction' },
            { status: 500 }
        );
    }
}

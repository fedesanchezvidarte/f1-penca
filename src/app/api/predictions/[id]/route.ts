import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/predictions/[id] - Get user prediction for a race
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
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
            raceWinner: positions[0] || '',
            secondPlace: positions[1] || '',
            thirdPlace: positions[2] || '',
            fourthPlace: positions[3] || '',
            fifthPlace: positions[4] || '',
            sprintPole: prediction.sprintPolePrediction || undefined,
            sprintWinner: sprintPositions ? sprintPositions[0] : undefined,
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
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: raceId } = await params;
        const body = await request.json();

        // Check if race is still open for predictions
        const race = await prisma.race.findUnique({
            where: { id: raceId },
            select: { status: true },
        });

        if (!race) {
            return NextResponse.json({ error: 'Race not found' }, { status: 404 });
        }

        if (race.status !== 'UPCOMING') {
            return NextResponse.json(
                { error: 'Predictions are closed for this race' },
                { status: 400 }
            );
        }

        const positions = [
            body.raceWinner,
            body.secondPlace,
            body.thirdPlace,
            body.fourthPlace,
            body.fifthPlace,
        ];

        const sprintPositions = body.sprintWinner ? [body.sprintWinner] : null;

        const updatedPrediction = await prisma.prediction.updateMany({
            where: {
                raceId,
                userId: session.user.id,
            },
            data: {
                polePositionPrediction: body.polePosition,
                positions: positions,
                fastestLapPrediction: null, // Not implemented yet
                sprintPositions: sprintPositions || undefined,
                sprintPolePrediction: body.sprintPole || null,
                updatedAt: new Date(),
            },
        });

        if (updatedPrediction.count === 0) {
            return NextResponse.json(
                { error: 'Prediction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating prediction:', error);
        return NextResponse.json(
            { error: 'Failed to update prediction' },
            { status: 500 }
        );
    }
}

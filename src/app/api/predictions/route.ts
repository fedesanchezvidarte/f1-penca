// src/app/api/predictions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/predictions
 * Gets all predictions for the current user or for a specific user if admin
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'ADMIN';

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const targetUserId = searchParams.get('userId');
        const raceId = searchParams.get('raceId');

        // Build the query
        const query: {
            userId?: string;
            raceId?: string;
        } = {};

        // If not admin, user can only see their own predictions
        if (!isAdmin || !targetUserId) {
            query.userId = userId;
        } else if (isAdmin && targetUserId) {
            query.userId = targetUserId;
        }

        // Filter by race if provided
        if (raceId) {
            query.raceId = raceId;
        }
        // Get predictions
        const predictions = await prisma.prediction.findMany({
            where: query,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                race: true,
            },
            orderBy: {
                race: {
                    date: 'asc',
                },
            },
        });

        return NextResponse.json(predictions);
    } catch (error) {
        console.error('Error getting predictions:', error);
        return NextResponse.json(
            { error: 'Error getting predictions' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/predictions
 * Creates a new prediction for the current user
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { raceId, positions, polePositionPrediction, sprintPolePrediction, sprintPositions } = body;

        // Validate data
        if (!raceId || !positions || !Array.isArray(positions)) {
            return NextResponse.json(
                { error: 'Invalid data. raceId and positions (array) are required' },
                { status: 400 }
            );
        }

        // Verify the race exists and is in UPCOMING status
        const race = await prisma.race.findUnique({
            where: { id: raceId }
        });

        if (!race) {
            return NextResponse.json(
                { error: 'Race does not exist' },
                { status: 404 }
            );
        }

        if (race.status !== 'UPCOMING') {
            return NextResponse.json(
                { error: 'Predictions can only be created for upcoming races' },
                { status: 400 }
            );
        }
        
        // Check if a prediction already exists for this user and race
        const existingPrediction = await prisma.prediction.findFirst({
            where: {
                userId,
                raceId,
            },
        });

        let prediction;

        if (existingPrediction) {
            // Update existing prediction
            prediction = await prisma.prediction.update({
                where: { id: existingPrediction.id },
                data: {
                    positions,
                    polePositionPrediction: polePositionPrediction || null,
                    sprintPolePrediction: sprintPolePrediction || null,
                    sprintPositions: sprintPositions || null,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Create new prediction
            prediction = await prisma.prediction.create({
                data: {
                    userId,
                    raceId,
                    positions,
                    polePositionPrediction: polePositionPrediction || null,
                    sprintPolePrediction: sprintPolePrediction || null,
                    sprintPositions: sprintPositions || null,
                },
            });
        }

        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error creating/updating prediction:', error);
        return NextResponse.json(
            { error: 'Error creating/updating prediction' },
            { status: 500 }
        );
    }
}

// src/app/api/predictions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/predictions/[id]
 * Gets a specific prediction
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'ADMIN';
        const predictionId = params.id;

        // Get the prediction
        const prediction = await prisma.prediction.findUnique({
            where: { id: predictionId },
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
        });

        // Check if prediction exists
        if (!prediction) {
            return NextResponse.json(
                { error: 'Prediction not found' },
                { status: 404 }
            );
        }

        // Check if user has permission to view this prediction
        if (prediction.userId !== userId && !isAdmin) {
            return NextResponse.json(
                { error: 'Not authorized to view this prediction' },
                { status: 403 }
            );
        }
        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error getting prediction:', error);
        return NextResponse.json(
            { error: 'Error getting prediction' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/predictions/[id]
 * Deletes a specific prediction
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const isAdmin = session.user.role === 'ADMIN';
        const predictionId = params.id;

        // Get the prediction
        const prediction = await prisma.prediction.findUnique({
            where: { id: predictionId },
            include: {
                race: true,
            },
        });

        // Check if prediction exists
        if (!prediction) {
            return NextResponse.json(
                { error: 'Prediction not found' },
                { status: 404 }
            );
        }

        // Check if user has permission to delete this prediction
        if (prediction.userId !== userId && !isAdmin) {
            return NextResponse.json(
                { error: 'Not authorized to delete this prediction' },
                { status: 403 }
            );
        }

        // Check that the race hasn't started
        if (prediction.race.status !== 'UPCOMING') {
            return NextResponse.json(
                { error: 'Cannot delete a prediction for a race that has already started or finished' },
                { status: 400 }
            );
        }
        // Delete the prediction
        await prisma.prediction.delete({
            where: { id: predictionId },
        });

        return NextResponse.json(
            { message: 'Prediction successfully deleted' }
        );
    } catch (error) {
        console.error('Error deleting prediction:', error);
        return NextResponse.json(
            { error: 'Error deleting prediction' },
            { status: 500 }
        );
    }
}

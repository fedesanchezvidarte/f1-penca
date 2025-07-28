// src/app/api/races/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/races/[id]
 * Gets a specific race
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

        const { id: raceId } = await params;

        // Get the race with results and predictions for the current user
        const race = await prisma.race.findUnique({
            where: { id: raceId },
            include: {
                results: true,
                predictions: {
                    where: {
                        userId: session.user.id,
                    },
                },
            },
        });

        // Check if race exists
        if (!race) {
            return NextResponse.json(
                { error: 'Race not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(race);
    } catch (error) {
        console.error('Error getting race:', error);
        return NextResponse.json(
            { error: 'Error getting race' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/races/[id]
 * Updates a specific race (admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const raceId = params.id;

        // Get updated data
        const {
            name,
            round,
            circuit,
            date,
            season,
            status,
            resultsImported,
        } = await request.json();

        // Check if race exists
        const existingRace = await prisma.race.findUnique({
            where: { id: raceId },
        });

        if (!existingRace) {
            return NextResponse.json(
                { error: 'Race not found' },
                { status: 404 }
            );
        }
        // Prepare data for update
        const updateData: {
            name?: string;
            round?: number;
            circuit?: string;
            date?: Date;
            season?: number;
            status?: 'UPCOMING' | 'LIVE' | 'COMPLETED';
            resultsImported?: boolean;
        } = {};

        if (name !== undefined) updateData.name = name;
        if (round !== undefined) updateData.round = round;
        if (circuit !== undefined) updateData.circuit = circuit;
        if (date !== undefined) updateData.date = new Date(date);
        if (season !== undefined) updateData.season = season;
        if (status !== undefined) updateData.status = status;
        if (resultsImported !== undefined) updateData.resultsImported = resultsImported;

        // Check if there's data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No data provided for update' },
                { status: 400 }
            );
        }
        // Update race
        const updatedRace = await prisma.race.update({
            where: { id: raceId },
            data: updateData,
        });

        return NextResponse.json(updatedRace);
    } catch (error) {
        console.error('Error updating race:', error);
        return NextResponse.json(
            { error: 'Error updating race' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/races/[id]
 * Deletes a specific race (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
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

        const raceId = params.id;

        // Check if race exists
        const race = await prisma.race.findUnique({
            where: { id: raceId },
            include: {
                predictions: {
                    select: { id: true },
                },
                results: {
                    select: { id: true },
                },
            },
        });

        if (!race) {
            return NextResponse.json(
                { error: 'Race not found' },
                { status: 404 }
            );
        }

        // Check if it has associated predictions or results
        if (race.predictions.length > 0 || race.results.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete a race with associated predictions or results' },
                { status: 400 }
            );
        }

        // Delete race
        await prisma.race.delete({
            where: { id: raceId },
        });

        return NextResponse.json(
            { message: 'Race successfully deleted' }
        );
    } catch (error) {
        console.error('Error deleting race:', error);
        return NextResponse.json(
            { error: 'Error deleting race' },
            { status: 500 }
        );
    }
}

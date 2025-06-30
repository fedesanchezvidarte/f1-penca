// src/app/api/standings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/standings
 * Gets user rankings and points across all races.
 * This is the overall leaderboard.
 */
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'USER', // Exclude admins from standings
            },
            select: {
                id: true,
                name: true,
                image: true,
                totalPoints: true,
            },
            orderBy: {
                totalPoints: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching overall standings:', error);
        return NextResponse.json(
            { message: 'An error occurred while fetching the standings.' },
            { status: 500 }
        );
    }
}

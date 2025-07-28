// src/app/api/seasons/[year]/standings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/seasons/[year]/standings
 * Gets user rankings and points for a specific season.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ year: string }> }
) {
    try {
        const { year: yearParam } = await params;
        const year = parseInt(yearParam, 10);

        if (isNaN(year)) {
            return NextResponse.json(
                { message: 'Invalid year provided.' },
                { status: 400 }
            );
        }

        const usersWithPoints = await prisma.user.findMany({
            where: {
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                image: true,
                predictions: {
                    where: {
                        race: {
                            season: year,
                        },
                    },
                    select: {
                        points: true,
                    },
                },
            },
        });

        const standings = usersWithPoints
            .map((user) => {
                const totalPoints = user.predictions.reduce(
                    (sum, p) => sum + p.points,
                    0
                );
                return {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                    totalPoints,
                };
            })
            .sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json(standings);
    } catch (error) {
        console.error(`Error fetching standings for season:`, error);
        return NextResponse.json(
            {
                message:
                    'An error occurred while fetching the season standings.',
            },
            { status: 500 }
        );
    }
}

// src/app/api/teams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/teams/[id]
 * Gets detailed information about a specific team based on team name
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

        const teamName = decodeURIComponent(params.id);

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const activeOnly = searchParams.get('active') === 'true';

        // Get all drivers for this team
        const drivers = await prisma.driver.findMany({
            where: {
                team: teamName,
                ...(activeOnly ? { active: true } : {}),
            },
            orderBy: {
                number: 'asc',
            },
        });

        // Check if team exists (has any drivers)
        if (drivers.length === 0) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }

        // Construct team information
        const team = {
            name: teamName,
            drivers,
            activeDrivers: drivers.filter(driver => driver.active).length,
            inactiveDrivers: drivers.filter(driver => !driver.active).length,
        };

        return NextResponse.json(team);
    } catch (error) {
        console.error(`Error getting team ${params.id}:`, error);
        return NextResponse.json(
            { error: `Error getting team details` },
            { status: 500 }
        );
    }
}

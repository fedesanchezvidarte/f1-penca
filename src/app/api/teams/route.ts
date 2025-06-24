// src/app/api/teams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/teams
 * Gets all teams extracted from driver data
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const activeOnly = searchParams.get('active') === 'true';        const activeFilter = activeOnly ? { active: true } : {};

        // Get all unique teams from the driver table
        const teamRecords = await prisma.driver.findMany({
            where: activeFilter,
            select: {
                team: true,
            },
            distinct: ['team'],
        });
        
        // Extract teams and sort them alphabetically
        const teams = teamRecords
            .map(record => record.team)
            .sort();

        // Get drivers for each team
        const teamsWithDrivers = await Promise.all(
            teams.map(async team => {
                const drivers = await prisma.driver.findMany({
                    where: {
                        team,
                        ...(activeOnly ? { active: true } : {}),
                    },
                    orderBy: {
                        number: 'asc',
                    },
                });

                return {
                    name: team,
                    drivers: drivers.map(driver => ({
                        id: driver.id,
                        number: driver.number,
                        code: driver.code,
                        fullname: driver.fullname,
                        active: driver.active,
                    })),
                };
            })
        );

        return NextResponse.json(teamsWithDrivers);
    } catch (error) {
        console.error('Error getting teams:', error);
        return NextResponse.json(
            { error: 'Error getting teams' },
            { status: 500 }
        );
    }
}

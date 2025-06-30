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
        const activeOnly = searchParams.get('active') === 'true';
        const activeFilter = activeOnly ? { active: true } : {};

        // Define a type for the driver details to be returned
        type DriverInfo = {
            id: string;
            number: number;
            code: string;
            fullname: string;
            active: boolean;
        };

        // Get all drivers, filtered if necessary
        const drivers = await prisma.driver.findMany({
            where: activeFilter,
            orderBy: {
                team: 'asc', // Sort by team to make grouping easier
                number: 'asc',
            },
        });

        // Group drivers by team using a reducer
        const teamsWithDrivers = drivers.reduce((acc, driver) => {
            // Find the team in the accumulator
            let team = acc.find(t => t.name === driver.team);

            // If the team doesn't exist, create it
            if (!team) {
                team = {
                    name: driver.team,
                    drivers: [],
                };
                acc.push(team);
            }

            // Add the driver to the team
            team.drivers.push({
                id: driver.id,
                number: driver.number,
                code: driver.code,
                fullname: driver.fullname,
                active: driver.active,
            });

            return acc;
        }, [] as { name: string; drivers: DriverInfo[] }[]);

        return NextResponse.json(teamsWithDrivers);
    } catch (error) {
        console.error('Error getting teams:', error);
        return NextResponse.json(
            { error: 'Error getting teams' },
            { status: 500 }
        );
    }
}

// src/app/api/drivers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/drivers
 * Gets all drivers, optionally filtered by status (active/inactive)
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
        const activeFilter = searchParams.get('active');
        const teamFilter = searchParams.get('team');

        // Build the query
        const query: {
            active?: boolean;
            team?: string;
        } = {};

        // Filter by active status if provided
        if (activeFilter !== null) {
            query.active = activeFilter === 'true';
        }

        // Filter by team if provided
        if (teamFilter) {
            query.team = teamFilter;
        }

        // Get drivers
        const drivers = await prisma.driver.findMany({
            where: query,
            orderBy: [
                { team: 'asc' },
                { number: 'asc' },
            ],
        });

        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error getting drivers:', error);
        return NextResponse.json(
            { error: 'Error getting drivers' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/drivers
 * Creates a new driver (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Administrator permissions required' },
                { status: 403 }
            );
        }

        const {
            number,
            code,
            firstname,
            lastname,
            fullname,
            nationality,
            team,
            active = true,
        } = await request.json();
        // Validate data
        if (!number || !code || !firstname || !lastname || !nationality || !team) {
            return NextResponse.json(
                { error: 'Invalid data. All fields are required' },
                { status: 400 }
            );
        }

        // Check if a driver with the same number or code already exists
        const existingDriver = await prisma.driver.findFirst({
            where: {
                OR: [
                    { number },
                    { code },
                ],
            },
        });
        if (existingDriver) {
            let errorMessage = '';
            if (existingDriver.number === number) {
                errorMessage = `A driver with number ${number} already exists`;
            } else {
                errorMessage = `A driver with code ${code} already exists`;
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
            );
        }

        // Create new driver
        const driver = await prisma.driver.create({
            data: {
                number,
                code,
                firstname,
                lastname,
                fullname: fullname || `${firstname} ${lastname}`,
                nationality,
                team,
                active,
            },
        });

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json(
            { error: 'Error creating driver' },
            { status: 500 }
        );
    }
}

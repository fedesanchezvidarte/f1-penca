// src/app/api/drivers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/drivers/[id]
 * Gets a specific driver
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the driver
        const driver = await prisma.driver.findUnique({
            where: { id },
        });
        // Check if driver exists
        if (!driver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(driver);
    } catch (error) {
        console.error('Error getting driver:', error);
        return NextResponse.json(
            { error: 'Error getting driver' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/drivers/[id]
 * Updates a specific driver (admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Administrator permissions required' },
                { status: 403 }
            );
        }

        // Get updated data
        const {
            number,
            code,
            firstname,
            lastname,
            fullname,
            nationality,
            team,
            active, } = await request.json();
        // Check if driver exists
        const existingDriver = await prisma.driver.findUnique({
            where: { id },
        });

        if (!existingDriver) {
            return NextResponse.json(
                { error: 'Driver not found' },
                { status: 404 }
            );
        }

        // Check if another driver already exists with the same number or code
        if (number !== undefined && number !== existingDriver.number) {
            const driverWithNumber = await prisma.driver.findUnique({
                where: { number },
            });

            if (driverWithNumber && driverWithNumber.id !== id) {
                return NextResponse.json(
                    { error: `A driver with number ${number} already exists` },
                    { status: 400 }
                );
            }
        }

        if (code !== undefined && code !== existingDriver.code) {
            const driverWithCode = await prisma.driver.findUnique({
                where: { code },
            });

            if (driverWithCode && driverWithCode.id !== id) {
                return NextResponse.json(
                    { error: `A driver with code ${code} already exists` },
                    { status: 400 }
                );
            }
        }

        // Prepare data for update
        const updateData: {
            number?: number;
            code?: string;
            firstname?: string;
            lastname?: string;
            fullname?: string;
            nationality?: string;
            team?: string;
            active?: boolean;
        } = {};

        if (number !== undefined) updateData.number = number;
        if (code !== undefined) updateData.code = code;
        if (firstname !== undefined) updateData.firstname = firstname;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (fullname !== undefined) updateData.fullname = fullname;
        if (nationality !== undefined) updateData.nationality = nationality;
        if (team !== undefined) updateData.team = team;
        if (active !== undefined) updateData.active = active;

        // Update fullname if firstname or lastname changed but fullname was not provided
        if ((firstname !== undefined || lastname !== undefined) && fullname === undefined) {
            updateData.fullname = `${firstname || existingDriver.firstname} ${lastname || existingDriver.lastname}`;
        }
        // Check if there is data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No data provided for update' },
                { status: 400 }
            );
        }

        // Update driver
        const updatedDriver = await prisma.driver.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver:', error);
        return NextResponse.json(
            { error: 'Error updating driver' },
            { status: 500 }
        );
    }
}

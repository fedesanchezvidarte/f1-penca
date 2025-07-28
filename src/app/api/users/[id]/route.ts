// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/users/[id]
 * Gets a specific user's details
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

        const { id: userId } = await params;
        const isAdmin = session.user.role === 'ADMIN';
        const isSelfLookup = session.user.id === userId;

        // Only allow users to view their own profile or admins to view any profile
        if (!isSelfLookup && !isAdmin) {
            return NextResponse.json(
                { error: 'Not authorized to view this user' },
                { status: 403 }
            );
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        predictions: true,
                    },
                },
                // Include summary of predictions if it's the user themselves or an admin
                ...(isSelfLookup || isAdmin
                    ? {
                          predictions: {
                              select: {
                                  id: true,
                                  raceId: true,
                                  points: true,
                                  createdAt: true,
                                  updatedAt: true,
                                  race: {
                                      select: {
                                          id: true,
                                          name: true,
                                          date: true,
                                          status: true,
                                      },
                                  },
                              },
                              orderBy: {
                                  createdAt: 'desc',
                              },
                              take: 10,
                          },
                      }
                    : {}),
            },
        });

        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json(
            { error: 'Error getting user' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/users/[id]
 * Updates a specific user's details
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Verify authentication
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: userId } = await params;
        const isAdmin = session.user.role === 'ADMIN';
        const isSelfUpdate = session.user.id === userId;

        // Only allow users to update their own profile or admins to update any profile
        if (!isSelfUpdate && !isAdmin) {
            return NextResponse.json(
                { error: 'Not authorized to update this user' },
                { status: 403 }
            );
        }

        // Get updated data
        const { name, image, role } = await request.json();

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prepare data for update
        const updateData: {
            name?: string;
            image?: string;
            role?: 'USER' | 'ADMIN';
        } = {};

        // Regular users can only update their own name and image
        if (isSelfUpdate && !isAdmin) {
            if (name !== undefined) updateData.name = name;
            if (image !== undefined) updateData.image = image;
        } else if (isAdmin) {
            // Admins can update any field
            if (name !== undefined) updateData.name = name;
            if (image !== undefined) updateData.image = image;
            if (role !== undefined && ['USER', 'ADMIN'].includes(role)) {
                updateData.role = role as 'USER' | 'ADMIN';
            }
        }

        // Check if there's data to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No valid data provided for update' },
                { status: 400 }
            );
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Error updating user' },
            { status: 500 }
        );
    }
}

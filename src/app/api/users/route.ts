// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/users
 * Gets all users (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin permissions required' },
                { status: 403 }
            );
        }

        // Get query parameters for filtering
        const searchParams = request.nextUrl.searchParams;
        const role = searchParams.get('role');

        // Build the query
        const query: {
            role?: 'USER' | 'ADMIN';
        } = {};

        // Filter by role if provided
        if (role && ['USER', 'ADMIN'].includes(role)) {
            query.role = role as 'USER' | 'ADMIN';
        }

        // Get users, excluding sensitive information
        const users = await prisma.user.findMany({
            where: query,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        predictions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        return NextResponse.json(
            { error: 'Error getting users' },
            { status: 500 }
        );
    }
}

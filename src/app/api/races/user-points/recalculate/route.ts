import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { recalculateAllPoints } from '@/services/points-calculation';

/**
 * POST /api/races/user-points/recalculate
 * Manually recalculate all points for all predictions (admin only)
 */
export async function POST() {
    try {
        const session = await auth();

        // Verify authentication and admin role
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin permissions required' },
                { status: 403 }
            );
        }

        // Trigger points recalculation
        await recalculateAllPoints();

        return NextResponse.json({ 
            message: 'All points have been recalculated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error recalculating points:', error);
        return NextResponse.json(
            { error: 'Error recalculating points' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAndGetUser } from '@/lib/googleAuth';

export async function GET(request) {
    // 1. Verify Google Token
    const user = await verifyAndGetUser(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized: Invalid or missing Google Token" }, { status: 401 });
    }

    console.log(`Checking sync status for user: ${user.email} (${user.id})`);

    try {
        const healthSync = await prisma.healthSync.findUnique({
            where: { userId: user.id },
            select: { syncPending: true }
        });

        // Default to false if record doesn't exist
        return NextResponse.json({ sync_pending: healthSync?.syncPending || false });
    } catch (error) {
        console.error("Database error checking sync status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

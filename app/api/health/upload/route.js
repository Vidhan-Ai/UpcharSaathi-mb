import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAndGetUser } from '@/lib/googleAuth';

export async function POST(request) {
    // 1. Verify Google Token
    const user = await verifyAndGetUser(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized: Invalid or missing Google Token" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { data } = body; // Body no longer needs userId, or we ignore it

        console.log(`Receiving upload for: ${user.email}`, data?.length);

        if (!data) {
            return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
        }

        // Upsert the HealthSync record using the verified user ID
        await prisma.healthSync.upsert({
            where: { userId: user.id },
            update: {
                syncPending: false, // Turn off flag
                lastSynced: new Date(),
                data: data // Save the raw array
            },
            create: {
                userId: user.id,
                syncPending: false,
                lastSynced: new Date(),
                data: data
            }
        });

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Database error uploading data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

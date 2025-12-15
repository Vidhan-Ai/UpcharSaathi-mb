
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stackServerApp } from "@/stack/server";

export async function POST(request) {
    // Authenticate Web User
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log(`Requesting sync for user: ${user.id}`);
        // Set syncPending to true
        await prisma.healthSync.upsert({
            where: { userId: user.id },
            update: { syncPending: true },
            create: {
                userId: user.id,
                syncPending: true,
                data: [] // init empty if new
            }
        });

        return NextResponse.json({ status: "success", message: "Sync requested" });
    } catch (error) {
        console.error("Error requesting sync:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stackServerApp } from "@/stack/server";

export async function GET(request) {
    // Authenticate Web User
    // Authenticate Web User
    const user = await stackServerApp.getUser();
    if (!user || !user.primaryEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const dbUser = await prisma.users.findUnique({
            where: { email: user.primaryEmail }
        });

        if (!dbUser) {
            // If local user doesn't exist, they can't have synced data
            return NextResponse.json([]);
        }

        const record = await prisma.healthSync.findUnique({
            where: { userId: dbUser.id }
        });

        // If no data, return empty array
        const healthData = record?.data || [];

        return NextResponse.json(healthData);
    } catch (error) {
        console.error("Error fetching health data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

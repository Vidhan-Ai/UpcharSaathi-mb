import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAndGetUser } from '@/lib/googleAuth';
import { stackServerApp } from "@/stack/server";

// ⚠️ CRITICAL: Function must be named 'POST'
export async function GET(request) {
    // Authenticate Web User (Stack Auth)
    const user = await stackServerApp.getUser();

    if (!user || !user.primaryEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const dbUser = await prisma.users.findUnique({
            where: { email: user.primaryEmail }
        });

        if (!dbUser) {
            return NextResponse.json([], { status: 200 }); // No user in DB yet = no records
        }

        const records = await prisma.healthRecord.findMany({
            where: { userId: dbUser.id },
            orderBy: { date: 'desc' },
            take: 50
        });

        return NextResponse.json(records);

    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {

    // 1. Verify User
    const user = await verifyAndGetUser(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. Parse the JSON body
        // In App Router, we use await request.json()
        const body = await request.json();
        const { data } = body; // Matches "UploadBody" in Android

        if (!data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        console.log(`Processing ${data.length} records for ${user.email}`);


        if (data.length > 0) {
            await prisma.healthRecord.createMany({
                data: data.map(record => ({
                    userId: user.id,
                    type: record.type,
                    count: record.count ? Number(record.count) : null,
                    bpm: record.bpm ? Number(record.bpm) : null,
                    value: record.value ? Number(record.value) : null,
                    duration: record.duration ? Number(record.duration) : null,
                    systolic: record.systolic ? Number(record.systolic) : null,
                    diastolic: record.diastolic ? Number(record.diastolic) : null,
                    date: new Date(record.date),
                }))
            });
        }

        // 4. Reset the "Sync Pending" flag since we just got the data

        await prisma.healthSync.upsert({
            where: { userId: user.id },
            update: { syncPending: false, lastSynced: new Date() },
            create: { userId: user.id, syncPending: false, lastSynced: new Date() }
        });

        return NextResponse.json({ status: "success", count: data.length });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
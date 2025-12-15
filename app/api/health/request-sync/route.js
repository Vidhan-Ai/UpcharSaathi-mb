
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stackServerApp } from "@/stack/server";

export async function POST(request) {
    // Authenticate Web User
    const user = await stackServerApp.getUser();
    if (!user || !user.primaryEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Resolve to Prisma User (matching Android Google Auth identity)
        let dbUser = await prisma.users.findUnique({
            where: { email: user.primaryEmail }
        });

        // JIT Provisioning: Create user if they don't exist in our DB
        if (!dbUser) {
            console.log(`Creating new DB user for ${user.primaryEmail}`);
            try {
                dbUser = await prisma.users.create({
                    data: {
                        email: user.primaryEmail,
                        name: user.displayName || user.primaryEmail.split('@')[0],
                        password_hash: "google-auth-managed", // Placeholder
                        email_verified: true,
                        is_active: true
                    }
                });
            } catch (createError) {
                console.error("Failed to provision user:", createError);
                return NextResponse.json({ error: "Failed to provision user account" }, { status: 500 });
            }
        }

        console.log(`Requesting sync for user: ${dbUser.email} (${dbUser.id})`);

        // Set syncPending to true using Prisma User ID
        await prisma.healthSync.upsert({
            where: { userId: dbUser.id },
            update: { syncPending: true },
            create: {
                userId: dbUser.id,
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

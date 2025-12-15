import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyAndGetUser(request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Error: Missing or invalid Authorization header");
        return null;
    }

    const token = authHeader.split(' ')[1];

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // --- CHANGE: Use 'upsert' instead of 'findUnique' ---
        // This finds the user OR creates them if they don't exist.
        const user = await prisma.users.upsert({
            where: { email: email },
            update: {}, // No updates needed if they exist
            create: {
                email: email,
                name: payload.name || "Unknown User",
                // Add any other required fields here with default values
            },
        });

        console.log(`User verified: ${email}`);
        return user;

    } catch (error) {
        console.error("Auth Error:", error.message);
        return null;
    }
}
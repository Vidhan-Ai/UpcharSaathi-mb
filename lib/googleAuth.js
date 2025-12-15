
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifies Google ID Token and returns the associated Database User ID.
 * Falls back to creating a user or erroring depending on logic, but here acts as lookup.
 */
export async function verifyAndGetUser(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches Android/Web Client ID
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        // Find user by email in our DB
        const user = await prisma.users.findUnique({
            where: { email: email }
        });

        return user;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

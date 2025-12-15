
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifies Google ID Token and returns the associated Database User ID.
 * Falls back to creating a user or erroring depending on logic, but here acts as lookup.
 */
export async function verifyAndGetUser(request) {
    const authHeader = request.headers.get('authorization');

    // Debug Log 1: Did we get a header?
    if (!authHeader) {
        console.log("Error: No Authorization header received");
        return null;
    }

    const token = authHeader.split(' ')[1];

    // Debug Log 2: Show the first 10 chars of the token
    if (token) {
        console.log(`Verifying token: ${token.substring(0, 10)}...`);
    } else {
        console.log("Error: Authorization header format invalid");
        return null;
    }

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

        if (!user) {
            console.log(`Token verified but user not found for email: ${email}`);
        }

        return user;
    } catch (error) {
        // Debug Log 3: Why did Google reject it?
        console.error("Google Verify Error:", error.message);
        return null;
    }
}

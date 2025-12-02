import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }

    try {
        const user = await prisma.users.findFirst({
            where: {
                verification_token: token,
                verification_token_expires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        await prisma.users.update({
            where: { id: user.id },
            data: {
                email_verified: true,
                verification_token: null,
                verification_token_expires: null,
            },
        });

        // Redirect to login page with success message
        return NextResponse.redirect(new URL('/auth/login?verified=true', request.url));
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
    }
}

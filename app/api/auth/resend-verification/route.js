import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '@/lib/email';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';

export async function POST(request) {
    try {
        // Get user from token
        const cookieStore = cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            );
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.users.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        if (user.email_verified) {
            return NextResponse.json(
                { message: 'Email already verified' },
                { status: 400 }
            );
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update user with new token
        await prisma.users.update({
            where: { id: user.id },
            data: {
                verification_token: verificationToken,
                verification_token_expires: verificationTokenExpires,
            },
        });

        // Send verification email
        const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Verify your email address',
            html: emailTemplates.verifyEmail(verificationLink),
        });

        return NextResponse.json({
            message: 'Verification email sent successfully',
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { message: 'An error occurred' },
            { status: 500 }
        );
    }
}

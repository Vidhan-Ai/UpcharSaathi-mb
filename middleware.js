import { NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/auth';

// Simple in-memory rate limiting for demonstration (since Edge middleware has limited Redis support without HTTP-based Redis like Upstash)
// For production with standard Redis, you'd typically use a dedicated rate-limiting service or logic if supported.
// Here we'll implement a basic check or skip if complex.
// Actually, we can't use 'ioredis' directly in Edge Middleware easily.
// So we'll skip Redis-based rate limiting in middleware for now and focus on Auth.

export async function middleware(request) {
    // Rate Limiting Placeholder
    // In a real edge deployment, use Upstash Redis or similar HTTP-based Redis.

    // Auth Check for protected routes
    const protectedPaths = ['/profile', '/dashboard'];
    const path = request.nextUrl.pathname;

    if (protectedPaths.some(prefix => path.startsWith(prefix))) {
        const accessToken = request.cookies.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload) {
            // Token invalid or expired
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/dashboard/:path*', '/api/protected/:path*'],
};

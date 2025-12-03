import { NextResponse } from 'next/server';
// import { verifyAccessToken } from './lib/auth'; // Old auth

export async function middleware(request) {
    // The old middleware was checking for 'accessToken' cookie which is no longer used by Stack Auth.
    // Stack Auth handles session management.
    // For now, we rely on client-side protection in the Profile page.
    // If server-side protection is needed, we should integrate StackServerApp.getUser() here.

    return NextResponse.next();
}

export const config = {
    // Keep matcher if we want to add back logic later, or empty it.
    // matcher: ['/profile/:path*', '/dashboard/:path*', '/api/protected/:path*'],
    matcher: [],
};

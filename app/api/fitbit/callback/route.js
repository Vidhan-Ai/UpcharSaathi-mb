import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { stackServerApp } from "@/stack/server";
import { prisma } from "@/lib/db";

export async function GET(request) {
    const code = request.nextUrl.searchParams.get('code');
    const user = await stackServerApp.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/track-health?error=auth_failed_no_code', request.url));
    }

    const clientId = process.env.FITBIT_CLIENT_ID;
    const clientSecret = process.env.FITBIT_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/fitbit/callback`;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Fitbit Client ID or Secret not configured' }, { status: 500 });
    }

    try {
        // Exchange code for token
        const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                clientId: clientId,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                code: code
            })
        });

        const tokens = await tokenRes.json();

        if (tokens.errors || !tokens.access_token) {
            console.error("Fitbit Token Error:", tokens.errors || tokens);
            return NextResponse.redirect(new URL('/track-health?error=token_exchange_failed', request.url));
        }

        // Calculate expiry
        // tokens.expires_in is in seconds
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        // Save to DB
        await prisma.fitbitToken.upsert({
            where: { userId: user.id },
            update: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: expiresAt
            },
            create: {
                userId: user.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: expiresAt
            }
        });

        return NextResponse.redirect(new URL('/track-health?connected=true', request.url));
    } catch (err) {
        console.error("Callback Error:", err);
        return NextResponse.redirect(new URL('/track-health?error=callback_exception', request.url));
    }
}

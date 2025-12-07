import { NextResponse } from 'next/server';
import { stackServerApp } from "@/stack/server";

export async function GET(request) {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }

    const clientId = process.env.FITBIT_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/fitbit/callback`;
    const scope = 'activity heartrate sleep nutrition profile';

    if (!clientId) {
        return NextResponse.json({ error: 'Fitbit Client ID not configured. Please set FITBIT_CLIENT_ID in .env' }, { status: 500 });
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        expires_in: '604800' // 1 week
    });

    return NextResponse.redirect(`https://www.fitbit.com/oauth2/authorize?${params.toString()}`);
}

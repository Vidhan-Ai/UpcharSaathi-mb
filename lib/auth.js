import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-at-least-32-chars-long');
const REFRESH_SECRET_KEY = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-at-least-32-chars-long');

export async function signAccessToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m') // Short-lived access token
        .sign(SECRET_KEY);
}

export async function signRefreshToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Long-lived refresh token
        .sign(REFRESH_SECRET_KEY);
}

export async function verifyAccessToken(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function verifyRefreshToken(token) {
    try {
        const { payload } = await jwtVerify(token, REFRESH_SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

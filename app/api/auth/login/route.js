import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import redis from '@/lib/redis';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.users.findFirst({
      where: { email },
    });

    // If user doesn't exist or password doesn't match
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate Tokens
    const accessToken = await signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await signRefreshToken({ userId: user.id });

    // Store Refresh Token in Redis with timeout
    try {
      const redisTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis timeout')), 2000)
      );
      const redisSet = redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

      await Promise.race([redisSet, redisTimeout]);
    } catch (redisError) {
      console.warn('Failed to store refresh token in Redis:', redisError.message);
      // Continue login even if Redis fails (graceful degradation)
    }

    // Return user data (excluding password hash)
    const { password_hash: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });

    // Set Cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
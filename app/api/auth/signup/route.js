import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '@/lib/email';
import redis from '@/lib/redis';
import { signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Parse request body
    const { name, email, password, phone, dob, gender, blood_group } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with additional fields
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        verification_token: verificationToken,
        verification_token_expires: verificationTokenExpires,
        phone: phone || null,
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
        blood_group: blood_group || null,
      },
    });

    // Send verification email
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: email,
        subject: 'Verify your email address',
        html: emailTemplates.verifyEmail(verificationLink),
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
    }

    // Generate Tokens for Auto-Login
    const accessToken = await signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await signRefreshToken({ userId: user.id });

    // Store Refresh Token in Redis
    try {
      await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days
    } catch (redisError) {
      console.warn('Failed to store refresh token in Redis:', redisError.message);
    }

    // Return user data (excluding password hash)
    const { password_hash: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userWithoutPassword
    }, { status: 201 });

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
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
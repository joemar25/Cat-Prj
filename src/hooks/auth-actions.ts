// src/hooks/auth.ts
'use server';

import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/zod';

import { ROLE_PERMISSIONS } from '@/types/auth';
import { UserRole } from '@prisma/client';
import bcryptjs, { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === 'CredentialsSignin'
        ? { message: 'Invalid credentials' }
        : { message: 'Something went wrong' };
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut();
}

export async function handleSignUp({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!parsedCredentials.success) {
      return { success: false, message: 'Invalid data' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const now = new Date();

    // Default to ADMIN role because this is signup
    const userRole = UserRole.ADMIN;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: false,
          role: userRole,
          permissions: ROLE_PERMISSIONS[userRole],
          createdAt: now,
          updatedAt: now,
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          providerId: 'credentials',
          accountId: email,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      });
    });

    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}

type RegisterData = {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  occupation?: string;
  gender?: string;
  nationality?: string;
};

export async function handleRegistration(data: RegisterData) {
  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await hash(data.password, 10);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          emailVerified: false,
          role: UserRole.USER,
          permissions: ['QUEUE_VIEW'],
          createdAt: now,
          updatedAt: now,
        },
      });

      // Create account
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: 'credentials',
          accountId: data.email,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      });

      // Create profile
      await tx.profile.create({
        data: {
          userId: user.id,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          phoneNumber: data.phoneNumber || null,
          address: data.address || null,
          city: data.city || null,
          state: data.state || null,
          country: data.country || null,
          postalCode: data.postalCode || null,
          occupation: data.occupation || null,
          gender: data.gender || null,
          nationality: data.nationality || null,
        },
      });
    });

    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
}

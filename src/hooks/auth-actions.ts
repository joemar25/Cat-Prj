// src/lib/auth.config.ts
'use server'

import bcryptjs from 'bcryptjs'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/lib/auth'
import { createSignUpSchema } from '@/lib/validation'

// -----------------------------------------------------------------------------
// SIGN-IN FUNCTION
// -----------------------------------------------------------------------------
export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Fetch the user with roles from the database.
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Deny access if the user is not found or if all assigned roles have the name "User"
    // (meaning regular users are not allowed to sign in).
    if (!user || user.roles.every((ur) => ur.role?.name === 'User')) {
      return {
        success: false,
        message: 'Access denied. Regular users are not allowed to log in.',
      };
    }

    // If the account is deactivated (for example, not verified), return a custom error.
    if (!user.emailVerified) {
      return {
        success: false,
        message: 'Account disabled. Contact admin.',
      };
    }

    // Attempt sign in using NextAuth's signIn function.
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: 'Invalid credentials. Please try again.',
      };
    }

    return {
      success: true,
      redirectTo: '/dashboard',
    };
  } catch (error) {
    console.error('Signin error:', error);

    if (error instanceof AuthError) {
      return {
        success: false,
        message:
          error.type === 'CredentialsSignin'
            ? 'Invalid credentials'
            : 'Something went wrong during sign-in.',
      };
    }

    return { success: false, message: 'An unexpected error occurred.' };
  }
}

// -----------------------------------------------------------------------------
// SIGN-OUT FUNCTION
// -----------------------------------------------------------------------------
export async function handleSignOut() {
  await signOut();
}

// -----------------------------------------------------------------------------
// SIGN-UP FUNCTION
// -----------------------------------------------------------------------------
// Define the input type. Note that role is a plain string, as the dynamic schema will
// ensure that the submitted value is one of the allowed roles.
type SignUpInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: string
}

/*
  Option A (Default Allowed Roles)
  ---------------------------------
  // If desired, you can define a default allowed roles array for the server side sign-up.
  // This is useful if you want to have a fallback in case dynamic role query is not available.
  const defaultAllowedRoles = ["Admin", "Super Admin"];
  const signUpSchema = createSignUpSchema(defaultAllowedRoles);
  
  Option B (Dynamic Allowed Roles)
  --------------------------------
  In production the client should supply the allowed roles via a role query.
  For the server side sign-up here, you might prioritize a default set.
  For now, we use Option A as a fallback.
*/
const defaultAllowedRoles = ["Admin", "Super Admin"];
// Create a default sign-up schema instance using the default allowed roles.
const signUpSchema = createSignUpSchema(defaultAllowedRoles);

export async function handleSignUp({
  name,
  email,
  password,
  confirmPassword,
  role = 'Admin',
}: SignUpInput) {
  try {
    // Validate input using the dynamic schema.
    const parsedCredentials = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!parsedCredentials.success) {
      return { success: false, message: 'Invalid data' };
    }

    // Check if a user with the same email already exists.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const now = new Date();

    // Determine the role based on environment:
    // In development we use the provided role; in production we assign a default (e.g., 'Staff').
    const userRoleName = process.env.NODE_ENV === 'development' ? role : 'Staff';

    await prisma.$transaction(async (tx) => {
      // Create the user.
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: false,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      });

      // Get the role record from the database.
      const roleRecord = await tx.role.findUnique({
        where: { name: userRoleName },
      });

      if (!roleRecord) {
        throw new Error('Role not found');
      }

      // Assign role to the user.
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id,
        },
      });

      // Create the account.
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

// -----------------------------------------------------------------------------
// REGISTRATION FUNCTION
// -----------------------------------------------------------------------------
type RegisterData = {
  name: string
  email: string
  password: string
  dateOfBirth?: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  occupation?: string
  gender?: string
  nationality?: string
}

export async function handleRegistration(data: RegisterData) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await hash(data.password, 10);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // Create user.
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          emailVerified: false,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      });

      // Get the 'User' role.
      const userRole = await tx.role.findUnique({
        where: { name: 'User' },
      });

      if (!userRole) {
        throw new Error('User role not found');
      }

      // Assign role to user.
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });

      // Create account.
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

      // Create profile.
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

'use server'

import bcryptjs from 'bcryptjs'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/lib/auth'
import { signUpSchema } from '@/lib/validation'

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Fetch the user with roles
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    // Check if the user exists and has appropriate roles
    if (!user || user.roles.every(ur => ur.role.name === 'User')) {
      return {
        success: false,
        message: 'Access denied. Regular users are not allowed to log in.',
      };
    }

    // Attempt to sign in
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

export async function handleSignOut() {
  await signOut()
}

type SignUpInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'Super Admin' | 'Admin'
}

export async function handleSignUp({
  name,
  email,
  password,
  confirmPassword,
  role = 'Admin',
}: SignUpInput) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      role,
    })

    if (!parsedCredentials.success) {
      return { success: false, message: 'Invalid data' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, message: 'Email already exists' }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const now = new Date()

    // Determine the role based on environment
    const userRoleName = process.env.NODE_ENV === 'development' ? role : 'Staff'

    await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: false,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      })

      // Get the role
      const roleRecord = await tx.role.findUnique({
        where: { name: userRoleName }
      })

      if (!roleRecord) {
        throw new Error('Role not found')
      }

      // Assign role to user
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id
        }
      })

      // Create account
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: 'credentials',
          accountId: email,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      })
    })

    return { success: true, message: 'Account created successfully' }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

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
    })

    if (existingUser) {
      return { success: false, message: 'Email already exists' }
    }

    const hashedPassword = await hash(data.password, 10)
    const now = new Date()

    await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          emailVerified: false,
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      })

      // Get the 'User' role
      const userRole = await tx.role.findUnique({
        where: { name: 'User' }
      })

      if (!userRole) {
        throw new Error('User role not found')
      }

      // Assign role to user
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id
        }
      })

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
      })

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
      })
    })

    return { success: true, message: 'Registration successful' }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, message: 'Registration failed' }
  }
}
// src/hooks/auth.ts
'use server';

import { signIn, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RegistrationForm, registrationSchema, signUpSchema } from '@/lib/zod';
import { AuthError } from 'next-auth';

import bcryptjs from 'bcryptjs';

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

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: false,
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

export async function handleRegistration(data: RegistrationForm) {
  try {
    const parsedData = registrationSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, message: 'Invalid data' };
    }

    const { email, name, password } = data;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          emailVerified: false,
          createdAt: now,
          updatedAt: now,
        },
      });

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
      });

      // Create profile
      await tx.profile.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(data.dateOfBirth),
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          occupation: data.occupation,
          gender: data.gender,
          nationality: data.nationality,
        },
      });
    });

    // After successful registration, you can optionally sign in
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });

    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
}
// export async function handleRegistration(data: RegistrationForm) {
//   try {
//     const parsedData = registrationSchema.safeParse(data);
//     if (!parsedData.success) {
//       return { success: false, message: 'Invalid data' };
//     }

//     const {
//       name,
//       email,
//       password,
//       dateOfBirth,
//       phoneNumber,
//       address,
//       city,
//       state,
//       country,
//       postalCode,
//       occupation,
//       gender,
//       nationality,
//     } = parsedData.data;

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return { success: false, message: 'Email already exists' };
//     }

//     const hashedPassword = await bcryptjs.hash(password, 10);
//     const now = new Date();

//     await prisma.$transaction(async (tx) => {
//       const user = await tx.user.create({
//         data: {
//           email,
//           name,
//           emailVerified: false,
//           createdAt: now,
//           updatedAt: now,
//         },
//       });

//       await tx.account.create({
//         data: {
//           userId: user.id,
//           providerId: 'credentials',
//           accountId: email,
//           password: hashedPassword,
//           createdAt: now,
//           updatedAt: now,
//         },
//       });

//       await tx.profile.create({
//         data: {
//           userId: user.id,
//           dateOfBirth,
//           phoneNumber,
//           address,
//           city,
//           state,
//           country,
//           postalCode,
//           occupation,
//           gender,
//           nationality,
//         },
//       });
//     });

//     return { success: true, message: 'Registration successful' };
//   } catch (error) {
//     console.error('Registration error:', error);
//     return { success: false, message: 'An unexpected error occurred' };
//   }
// }

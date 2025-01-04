// src\hooks\auth-actions.ts
"use server"

import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/zod"
import { signIn, signOut } from "@/lib/auth"

import bcryptjs from "bcryptjs"
import { UserRole } from "@prisma/client"
import { ROLE_PERMISSIONS } from "@/types/auth"

export async function handleCredentialsSignin({ email, password }: {
    email: string,
    password: string
}) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // restricting user role for login
        if (!user || user.role === 'USER') {
            return { success: false, message: 'Access denied. User role not allowed.' }
        }

        await signIn("credentials", { email, password, redirectTo: "/dashboard" })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                message: error.type === 'CredentialsSignin'
                    ? 'Invalid credentials'
                    : 'Something went wrong'
            }
        }
        throw error
    }
}

export async function handleSignOut() {
    await signOut()
}

type SignUpInput = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: 'ADMIN' | 'STAFF';
}

export async function handleSignUp({
    name,
    email,
    password,
    confirmPassword,
    role = 'STAFF'
}: SignUpInput) {
    try {
        const parsedCredentials = signUpSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
            role
        });

        if (!parsedCredentials.success) {
            return { success: false, message: "Invalid data" };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { success: false, message: "Email already exists" };
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const now = new Date();

        // Determine the role based on environment and input
        const userRole: UserRole = process.env.NODE_ENV === 'development'
            ? (role as UserRole)
            : 'STAFF';

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
                }
            });

            await tx.account.create({
                data: {
                    userId: user.id,
                    providerId: "credentials",
                    accountId: email,
                    password: hashedPassword,
                    createdAt: now,
                    updatedAt: now
                }
            });
        });

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}
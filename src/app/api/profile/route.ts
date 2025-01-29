// src/app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const data = await request.json()

        // Start a transaction to update both user and profile
        const [user, profile] = await prisma.$transaction(async (tx) => {
            // Update user data
            const updatedUser = await tx.user.update({
                where: { id: session.user.id },
                data: {
                    username: data.username,
                    name: data.name,
                    image: data.image,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    username: true,
                    role: true,
                    permissions: true,
                }
            })

            // Update profile data
            const updatedProfile = await tx.profile.upsert({
                where: { userId: session.user.id },
                update: {
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    postalCode: data.postalCode,
                    bio: data.bio,
                    occupation: data.occupation,
                    gender: data.gender,
                    nationality: data.nationality,
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                    updatedAt: new Date(),
                },
                create: {
                    userId: session.user.id,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    postalCode: data.postalCode,
                    bio: data.bio,
                    occupation: data.occupation,
                    gender: data.gender,
                    nationality: data.nationality,
                    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                },
            })

            return [updatedUser, updatedProfile]
        })

        // Return both user and profile data for session update
        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user,
                profile
            }
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
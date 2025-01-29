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

        // Update user table if username is provided
        if (data.username) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username: data.username,
                    NOT: {
                        id: session.user.id
                    }
                }
            })

            if (existingUser) {
                return NextResponse.json(
                    { error: 'Username is already taken' },
                    { status: 400 }
                )
            }

            await prisma.user.update({
                where: { id: session.user.id },
                data: { username: data.username }
            })
        }

        // Update profile with only the fields that exist in the model
        const profileData = {
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
        }

        // Update profile
        const profile = await prisma.profile.upsert({
            where: { userId: session.user.id },
            update: profileData,
            create: {
                userId: session.user.id,
                ...profileData
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: profile
        })

    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
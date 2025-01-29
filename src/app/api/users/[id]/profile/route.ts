import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // ✅ Fix: Await params properly
        const { id: userId } = context.params

        const data = await request.json()

        console.log('Updating profile for userId:', userId)
        console.log('Received data:', data)

        // Ensure the user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // ✅ Update User model
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: data.username?.trim() || existingUser.username,
                name: data.name?.trim() || existingUser.name,
                email: data.email?.trim() || existingUser.email,
                updatedAt: new Date(),
            },
        })

        // ✅ Update or create the Profile model
        let updatedProfile
        if (existingUser.profile) {
            updatedProfile = await prisma.profile.update({
                where: { userId },
                data: {
                    phoneNumber: data.phoneNumber?.trim() || null,
                    address: data.address?.trim() || null,
                    city: data.city?.trim() || null,
                    state: data.state?.trim() || null,
                    country: data.country?.trim() || null,
                    postalCode: data.postalCode?.trim() || null,
                    bio: data.bio?.trim() || null,
                    occupation: data.occupation?.trim() || null,
                    gender: data.gender || null,
                    nationality: data.nationality?.trim() || null,
                    dateOfBirth: data.dateOfBirth && data.dateOfBirth !== '' ? new Date(data.dateOfBirth) : null,
                    updatedAt: new Date(),
                },
            })
        } else {
            updatedProfile = await prisma.profile.create({
                data: {
                    userId,
                    phoneNumber: data.phoneNumber?.trim() || null,
                    address: data.address?.trim() || null,
                    city: data.city?.trim() || null,
                    state: data.state?.trim() || null,
                    country: data.country?.trim() || null,
                    postalCode: data.postalCode?.trim() || null,
                    bio: data.bio?.trim() || null,
                    occupation: data.occupation?.trim() || null,
                    gender: data.gender || null,
                    nationality: data.nationality?.trim() || null,
                    dateOfBirth: data.dateOfBirth && data.dateOfBirth !== '' ? new Date(data.dateOfBirth) : null,
                },
            })
        }

        return NextResponse.json({
            success: true,
            message: 'User and profile updated successfully',
            data: { user: updatedUser, profile: updatedProfile },
        })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}

// src/app/api/upload-avatar/route.ts
import path from 'path'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'

export async function POST(request: Request) {
    try {

        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file')

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes((file as File).type)) {
            return NextResponse.json({
                error: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).'
            }, { status: 400 })
        }

        // Validate file size (5MB limit)
        if ((file as File).size > 5 * 1024 * 1024) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 5MB.'
            }, { status: 400 })
        }

        // Create a unique filename using userId and timestamp
        const fileExtension = path.extname((file as File).name)
        const filename = `${session.user.id}-${Date.now()}${fileExtension}`

        // Create avatar-profile directory path
        const avatarDir = path.join(process.cwd(), 'public/assets/avatar-profile')

        // Create the directory if it doesn't exist
        try {
            await mkdir(avatarDir, { recursive: true })
            console.log('Avatar directory created or already exists at:', avatarDir)
        } catch (mkdirError) {
            console.error('Error creating avatar directory:', mkdirError)
            throw mkdirError
        }

        // Convert file to buffer
        const buffer = Buffer.from(await (file as File).arrayBuffer())

        // Create full filepath
        const filepath = path.join(avatarDir, filename)
        console.log('Writing avatar to:', filepath)

        // Write file
        await writeFile(filepath, buffer)

        // Create public URL path
        const publicPath = `/assets/avatar-profile/${filename}`

        // Update user's image in database
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: publicPath }
        })

        return NextResponse.json({
            success: true,
            message: 'Avatar uploaded successfully',
            imageUrl: publicPath
        })

    } catch (error) {
        console.error('Avatar upload error:', error)
        return NextResponse.json({
            error: 'Failed to upload avatar',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user?.image) {
            return NextResponse.json({ error: 'No avatar to remove.' }, { status: 400 })
        }

        const avatarPath = path.join(process.cwd(), 'public', user.image)
        await unlink(avatarPath)

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: null }
        })

        return NextResponse.json({ success: true, message: 'Avatar removed successfully' })
    } catch (error) {
        console.error('Error removing avatar:', error)
        return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 })
    }
}
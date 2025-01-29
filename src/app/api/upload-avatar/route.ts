// src/app/api/upload-avatar/route.ts
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
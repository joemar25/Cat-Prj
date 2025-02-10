// src/app/api/upload-avatar/route.ts
import path from 'path'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'

async function getClientIp(request: Request): Promise<string> {
    const headersList = await headers()

    // Check X-Forwarded-For header first (common for proxied requests)
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
        // Get the first IP if there are multiple
        return forwardedFor.split(',')[0].trim()
    }

    // Check CF-Connecting-IP (Cloudflare)
    const cfIp = headersList.get('cf-connecting-ip')
    if (cfIp) {
        return cfIp
    }

    // Check True-Client-IP (Akamai and others)
    const trueClientIp = headersList.get('true-client-ip')
    if (trueClientIp) {
        return trueClientIp
    }

    // Fall back to X-Real-IP
    const realIp = headersList.get('x-real-ip')
    if (realIp) {
        return realIp
    }

    // Get IP from request object if available
    const remoteAddr = request.headers.get('remote-addr')
    if (remoteAddr) {
        return remoteAddr
    }

    return 'unknown'
}

async function createAuditLog(userId: string, userName: string, action: string, details: any, ipAddress: string, userAgent: string) {
    return prisma.auditLog.create({
        data: {
            userId,
            userName,
            action,
            entityType: 'USER',
            details,
            ipAddress,
            userAgent,
        },
    })
}

async function createNotification(userId: string, userName: string, action: string, ipAddress: string) {
    return prisma.notification.create({
        data: {
            userId,
            userName,
            type: 'SYSTEM',
            title: 'Profile Update',
            message: `Your profile avatar has been ${action}`,
            status: [],
        },
    })
}

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

        // Get IP address and user agent
        const ipAddress = await getClientIp(request)
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'unknown'

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

        // Use a transaction to ensure all updates happen together
        await prisma.$transaction(async (tx) => {
            // Update user's image and updatedAt in database
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    image: publicPath,
                    updatedAt: new Date()
                }
            })

            // Create audit log
            await createAuditLog(
                session.user.id,
                session.user.name || 'Unknown',
                'AVATAR_UPDATED',
                {
                    previousImage: session.user.image,
                    newImage: publicPath,
                    fileType: (file as File).type,
                    fileSize: (file as File).size,
                },
                ipAddress,
                userAgent
            )

            // Create notification
            await createNotification(
                session.user.id,
                session.user.name || 'Unknown',
                'updated',
                ipAddress
            )
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

        // Get IP address and user agent
        const ipAddress = await getClientIp(request)
        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'unknown'

        const avatarPath = path.join(process.cwd(), 'public', user.image)
        await unlink(avatarPath)

        // Use a transaction to ensure all updates happen together
        await prisma.$transaction(async (tx) => {
            // Update user record
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    image: null,
                    updatedAt: new Date()
                }
            })

            // Create audit log
            await createAuditLog(
                session.user.id,
                session.user.name || 'Unknown',
                'AVATAR_REMOVED',
                {
                    previousImage: user.image,
                },
                ipAddress,
                userAgent
            )

            // Create notification
            await createNotification(
                session.user.id,
                session.user.name || 'Unknown',
                'removed',
                ipAddress
            )
        })

        return NextResponse.json({ success: true, message: 'Avatar removed successfully' })
    } catch (error) {
        console.error('Error removing avatar:', error)
        return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 })
    }
}
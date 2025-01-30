import { hash } from 'bcryptjs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, context: { params: { id: string } }) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: userId } = context.params
        const { newPassword, confirmNewPassword } = await request.json()

        console.log('Updating password for userId:', userId)
        console.log('Received data:', { newPassword, confirmNewPassword })

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { accounts: true },
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (session.user.id !== userId && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
        }

        const userAccount = existingUser.accounts[0]
        if (!userAccount) {
            return NextResponse.json({ error: 'User account not found' }, { status: 404 })
        }

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
        }

        const hashedNewPassword = await hash(newPassword, 10)

        await prisma.account.update({
            where: { id: userAccount.id },
            data: { password: hashedNewPassword },
        })

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        })

    } catch (error) {
        console.error('Password update error:', error)
        return NextResponse.json({
            error: 'Failed to update password',
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 })
    }
}

'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const feedbackSchema = z.object({
    feedback: z.string().min(5, 'Feedback must be at least 5 characters long'),
    submittedBy: z.string().uuid().optional(),
})

type FeedbackInput = z.infer<typeof feedbackSchema>

export async function handleSubmitFeedback({ feedback }: FeedbackInput) {
    try {
        // Authenticate user
        const session = await auth()
        if (!session) {
            return { success: false, message: 'User not authenticated' }
        }

        const userId = session.user.id

        // Validate input data
        const parsedData = feedbackSchema.safeParse({ feedback })

        if (!parsedData.success) {
            return {
                success: false,
                message: parsedData.error.errors.map((e) => e.message).join(', '),
            }
        }

        // Create feedback entry
        await prisma.feedback.create({
            data: {
                feedback: parsedData.data.feedback,
                submittedBy: userId,
            },
        })

        return { success: true, message: 'Feedback submitted successfully' }
    } catch (error) {
        console.error('Error submitting feedback:', error)
        return { success: false, message: 'An unexpected error occurred while submitting feedback' }
    }
}

export async function fetchFeedbacks({ userId }: { userId?: string }) {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: userId ? { submittedBy: userId } : undefined,
            orderBy: { createdAt: 'desc' },
        })

        return { success: true, data: feedbacks }
    } catch (error) {
        console.error('Error fetching feedbacks:', error)
        return { success: false, message: 'Failed to fetch feedbacks' }
    }
}
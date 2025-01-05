import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        if (!body.feedback || !body.userId) {
            return NextResponse.json(
                { error: "Feedback and userId are required." },
                { status: 400 }
            )
        }

        // Create feedback entry in the database
        const feedback = await prisma.feedback.create({
            data: {
                feedback: body.feedback,
                submittedBy: body.userId,
            },
        })

        return NextResponse.json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback,
        })
    } catch (error) {
        console.error("Feedback creation error:", error)
        return NextResponse.json(
            {
                error: "Failed to submit feedback",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json(
                { error: "userId query parameter is required." },
                { status: 400 }
            )
        }

        const feedbacks = await prisma.feedback.findMany({
            where: { submittedBy: userId },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({
            success: true,
            data: feedbacks,
        })
    } catch (error) {
        console.error("Feedback fetch error:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch feedbacks",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

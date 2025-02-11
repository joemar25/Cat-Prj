import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json(
                { error: "Feedback ID is required." },
                { status: 400 }
            )
        }

        await prisma.feedback.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({
            success: true,
            message: "Feedback deleted successfully"
        })
    } catch (error) {
        console.error("Feedback deletion error:", error)
        return NextResponse.json(
            {
                error: "Failed to delete feedback",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}

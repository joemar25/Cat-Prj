"use server"

import { prisma } from "@/lib/prisma"
import { Document, DocumentStatus } from "@prisma/client"

/**
 * Fetch all available documents for download.
 * 
 * In this example, a document is available for download if:
 * - It has a status of VERIFIED, READY_FOR_RELEASE, or RELEASED.
 * - And it has at least one attachment.
 *
 * Adjust the filter criteria below as needed.
 */
export async function getAvailableDocuments(): Promise<Document[]> {
    try {
        const availableDocuments = await prisma.document.findMany({
            where: {
                status: {
                    in: [DocumentStatus.VERIFIED, DocumentStatus.READY_FOR_RELEASE, DocumentStatus.RELEASED],
                },
                attachments: {
                    some: {}, // this ensures that the document has at least one attachment
                },
            },
            include: {
                attachments: true, // include attachments so you can access fileUrl and other data in the frontend
            },
        })

        return availableDocuments
    } catch (error) {
        console.error("Error fetching available documents:", error)
        return []
    }
}

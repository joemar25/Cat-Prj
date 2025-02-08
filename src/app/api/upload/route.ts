// src/app/api/attachments/[id]/export/route.ts
import JSZip from "jszip"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCertifiedCopy } from "@/lib/pdf"
import { NextRequest, NextResponse } from "next/server"
import { Attachment, CertifiedCopy } from "@prisma/client"

// Define the type for the attachment with its relations
type AttachmentWithRelations = Attachment & {
    certifiedCopies: CertifiedCopy[]
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify authentication
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const includeZip = searchParams.get("zip") === "true"

        // Fetch attachment with certified copy data
        const attachment = await prisma.attachment.findUnique({
            where: {
                id: params.id
            },
            include: {
                certifiedCopies: true,
                document: {
                    include: {
                        civilRegistryForms: true
                    }
                }
            }
        }) as AttachmentWithRelations | null

        if (!attachment) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
        }

        // Download original file
        const fileRes = await fetch(attachment.fileUrl)
        if (!fileRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch original file" },
                { status: 500 }
            )
        }
        const fileBuffer = await fileRes.arrayBuffer()

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const fileExt = attachment.fileName.split(".").pop() || ""
        const newFileName = `${timestamp}-original.${fileExt}`

        if (!includeZip) {
            return new NextResponse(fileBuffer, {
                headers: {
                    "Content-Type": attachment.mimeType,
                    "Content-Disposition": `attachment; filename="${newFileName}"`
                }
            })
        }

        // Create ZIP with original file and certified copy if it exists
        const zip = new JSZip()

        // Add original file to zip
        zip.file(newFileName, Buffer.from(fileBuffer))

        // If there's a certified copy, generate and add the PDF
        const certifiedCopy = attachment.certifiedCopies[0]
        if (certifiedCopy) {
            try {
                const pdfBuffer = await generateCertifiedCopy({
                    ...certifiedCopy,
                    // Ensure dates are properly handled
                    date: certifiedCopy.date,
                    registeredDate: certifiedCopy.registeredDate,
                })

                // Add the certified copy PDF to the zip
                zip.file(`${timestamp}-certified.pdf`, pdfBuffer)
            } catch (error) {
                console.error("Error generating certified copy PDF:", error)
                return NextResponse.json(
                    { error: "Failed to generate certified copy PDF" },
                    { status: 500 }
                )
            }
        }

        // Generate the final zip file
        const zipBuffer = await zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        })

        // Send the response with appropriate headers
        return new NextResponse(zipBuffer, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${timestamp}-export.zip"`,
                "Content-Length": zipBuffer.length.toString()
            }
        })
    } catch (error) {
        console.error("Export error:", error)
        return NextResponse.json(
            { error: "Failed to process export" },
            { status: 500 }
        )
    }
}
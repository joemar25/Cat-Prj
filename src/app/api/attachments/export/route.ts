// src/app/api/attachments/export/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import JSZip from 'jszip'

// Helper function to format the current date and time as YYYY-MM-DD_HH-MM-SS.
function getFormattedDate(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const attachmentId = searchParams.get('attachmentId')
        const zipParam = searchParams.get('zip')

        if (!attachmentId) {
            return NextResponse.json({ error: 'Missing attachmentId' }, { status: 400 })
        }

        // Fetch the attachment from the database.
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId },
        })

        if (!attachment) {
            return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
        }

        // Prepare the file URL.
        // If attachment.fileUrl is not absolute, prepend the base URL.
        let fileUrl: string
        try {
            // Try creating a new URL. If it fails, we know it's relative.
            new URL(attachment.fileUrl)
            fileUrl = attachment.fileUrl
        } catch {
            // Use the NEXT_PUBLIC_BASE_URL or default to localhost.
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            fileUrl = new URL(attachment.fileUrl, baseUrl).href
        }

        // Fetch the file from the computed fileUrl.
        const fileRes = await fetch(fileUrl)
        if (!fileRes.ok) {
            return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
        }
        const fileBuffer = Buffer.from(await fileRes.arrayBuffer())

        // Generate a new filename based on the current date and time.
        // Preserve the file extension if present.
        const formattedDate = getFormattedDate()
        const extensionMatch = attachment.fileName.match(/(\.[^\.]+)$/)
        const extension = extensionMatch ? extensionMatch[1] : ''
        const newFileName = `${formattedDate}${extension}`

        if (zipParam === 'true') {
            const zip = new JSZip()
            // Use the new filename inside the zip instead of the original attachment name.
            zip.file(newFileName, fileBuffer)
            const zipContent = await zip.generateAsync({ type: 'nodebuffer' })
            // Create a zip filename like "2025-02-06_12-34-56-certified true xerox copy document.zip"
            const zipFileName = `${formattedDate}-certified-true-xerox-copy-document.zip`
            return new NextResponse(zipContent, {
                status: 200,
                headers: {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename="${zipFileName}"`,
                },
            })
        } else {
            // Return the file directly with the new filename.
            return new NextResponse(fileBuffer, {
                status: 200,
                headers: {
                    'Content-Type': attachment.mimeType,
                    'Content-Disposition': `attachment; filename="${newFileName}"`,
                },
            })
        }
    } catch (error) {
        console.error('Error in export API:', error)
        return NextResponse.json({ error: 'Failed to export attachment' }, { status: 500 })
    }
}

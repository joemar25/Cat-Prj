// src/app/api/attachments/[id]/export/route.ts
import path from "path"
import JSZip from "jszip"
import fs from "fs/promises"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCertifiedCopy } from "@/lib/pdf"
import { NextRequest, NextResponse } from "next/server"
import { Attachment, CertifiedCopy } from "@prisma/client"

// Define the type for the attachment with its relations
type AttachmentWithRelations = Attachment & {
    certifiedCopies: (CertifiedCopy & {
        form?: {
            formType: 'FORM_1A' | 'FORM_2A' | 'FORM_3A'
            birthForm?: {
                nameOfChild: string
                sex: string
                dateOfBirth: Date
                placeOfBirth: string
                nameOfMother: string
                citizenshipMother: string
                nameOfFather: string
                citizenshipFather: string
                dateMarriageParents?: Date | null
                placeMarriageParents?: string | null
            }
            deathForm?: {
                nameOfDeceased: string
                sex: string
                age: number
                civilStatus: string
                citizenship: string
                dateOfDeath: Date
                placeOfDeath: string
                causeOfDeath: string
            }
            marriageForm?: {
                husbandName: string
                husbandDateOfBirthAge: string
                husbandCitizenship: string
                husbandCivilStatus: string
                husbandMother: string
                husbandFather: string
                wifeName: string
                wifeDateOfBirthAge: string
                wifeCitizenship: string
                wifeCivilStatus: string
                wifeMother: string
                wifeFather: string
                dateOfMarriage: Date
                placeOfMarriage: string
            }
            preparedByName: string
            preparedByPosition: string
            verifiedByName: string
            verifiedByPosition: string
            civilRegistrar: string
            civilRegistrarPosition: string
        }
    })[]
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

        // Fetch attachment with certified copy data and related forms
        const attachment = await prisma.attachment.findUnique({
            where: {
                id: params.id
            },
            include: {
                certifiedCopies: {
                    include: {
                        form: {
                            include: {
                                birthForm: true,
                                deathForm: true,
                                marriageForm: true
                            }
                        }
                    }
                }
            }
        }) as AttachmentWithRelations | null

        if (!attachment) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
        }

        // Read the file from the filesystem
        try {
            const filePath = path.join(process.cwd(), 'public', attachment.fileUrl)
            const fileBuffer = await fs.readFile(filePath)

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

            const zip = new JSZip()
            zip.file(newFileName, fileBuffer)

            // If there's a certified copy, generate and add the PDF
            const certifiedCopy = attachment.certifiedCopies[0]
            if (certifiedCopy) {
                try {
                    const pdfBuffer = await generateCertifiedCopy({
                        ...certifiedCopy,
                        date: certifiedCopy.date || new Date(),
                        registeredDate: certifiedCopy.registeredDate || new Date(),
                        form: certifiedCopy.form
                    })

                    zip.file(`${timestamp}-certified.pdf`, pdfBuffer)
                } catch (error) {
                    console.error("Error generating certified copy PDF:", error)
                    return NextResponse.json(
                        { error: "Failed to generate certified copy PDF" },
                        { status: 500 }
                    )
                }
            }

            const zipBuffer = await zip.generateAsync({
                type: "nodebuffer",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 9
                }
            })

            return new NextResponse(zipBuffer, {
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Disposition": `attachment; filename="${timestamp}-export.zip"`,
                    "Content-Length": zipBuffer.length.toString()
                }
            })
        } catch (error) {
            console.error("File reading error:", error)
            return NextResponse.json(
                { error: "Failed to read file from storage" },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Export error:", error)
        return NextResponse.json(
            { error: "Failed to process export" },
            { status: 500 }
        )
    }
}
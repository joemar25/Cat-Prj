import path from "path"
import JSZip from "jszip"
import fs from "fs/promises"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateCertifiedCopy } from "@/lib/pdf"
import { NextRequest, NextResponse } from "next/server"
import { Attachment, CertifiedCopy } from "@prisma/client"

type AttachmentWithRelations = Attachment & {
    certifiedCopies: (CertifiedCopy & {
        form?: {
            formType: "FORM_1A" | "FORM_2A" | "FORM_3A"
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
    // Await dynamic route parameters as required
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const includeZip = searchParams.get("zip") === "true"

        const attachment = await prisma.attachment.findUnique({
            where: { id },
            include: {
                certifiedCopies: {
                    include: {
                        form: {
                            include: {
                                birthForm: true,
                                deathForm: true,
                                marriageForm: true,
                            },
                        },
                    },
                },
            },
        }) as AttachmentWithRelations | null

        if (!attachment) {
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
        }

        try {
            // Read the original file from storage
            const filePath = path.join(process.cwd(), "public", attachment.fileUrl)
            const fileBuffer = await fs.readFile(filePath)
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
            const fileExt = attachment.fileName.split(".").pop() || ""
            const newFileName = `${timestamp}-original.${fileExt}`

            if (!includeZip) {
                return new NextResponse(fileBuffer, {
                    headers: {
                        "Content-Type": attachment.mimeType,
                        "Content-Disposition": `attachment; filename="${newFileName}"`
                    },
                })
            }

            const zip = new JSZip()
            // Add the original file to the ZIP
            zip.file(newFileName, fileBuffer)

            // If a certified copy exists, generate the PDF
            const certifiedCopies = attachment.certifiedCopies
            if (certifiedCopies.length > 0) {
                // Find the first certified copy that matches the form type of the attachment
                const certifiedCopy = certifiedCopies.find(copy =>
                    copy.form &&
                    ((attachment.type === 'BIRTH_CERTIFICATE' && copy.form.formType === 'FORM_1A') ||
                        (attachment.type === 'DEATH_CERTIFICATE' && copy.form.formType === 'FORM_2A') ||
                        (attachment.type === 'MARRIAGE_CERTIFICATE' && copy.form.formType === 'FORM_3A'))
                ) || certifiedCopies[0]
                if (certifiedCopy && certifiedCopy.form) {
                    const baseForm = certifiedCopy.form

                    // Determine which form type is present and pass the appropriate form details
                    let specificForm;
                    switch (baseForm.formType) {
                        case "FORM_1A":
                            specificForm = baseForm.birthForm;
                            break;
                        case "FORM_2A":
                            specificForm = baseForm.deathForm;
                            break;
                        case "FORM_3A":
                            specificForm = baseForm.marriageForm;
                            break;
                    }

                    // Generate the certified copy PDF
                    try {
                        const pdfBuffer = await generateCertifiedCopy({
                            ...certifiedCopy,
                            date: certifiedCopy.date || new Date(),
                            registeredDate: certifiedCopy.registeredDate || new Date(),
                            form: {
                                formType: baseForm.formType,
                                preparedByName: baseForm.preparedByName,
                                preparedByPosition: baseForm.preparedByPosition,
                                verifiedByName: baseForm.verifiedByName,
                                verifiedByPosition: baseForm.verifiedByPosition,
                                civilRegistrar: baseForm.civilRegistrar,
                                civilRegistrarPosition: baseForm.civilRegistrarPosition,
                                specificForm: specificForm,
                            },
                        });

                        if (pdfBuffer) {
                            zip.file(`${timestamp}-certified.pdf`, pdfBuffer)
                        } else {
                            console.error("PDF generation failed: pdfBuffer is empty", {
                                certifiedCopy,
                                specificForm
                            });
                        }
                    } catch (pdfError) {
                        console.error("PDF Generation Error:", pdfError);
                    }
                }
            } else {
                console.warn("No certified copy or form data available for PDF generation")
            }

            const zipBuffer = await zip.generateAsync({
                type: "nodebuffer",
                compression: "DEFLATE",
                compressionOptions: { level: 9 },
            })

            return new NextResponse(zipBuffer, {
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Disposition": `attachment; filename="${timestamp}-export.zip"`,
                    "Content-Length": zipBuffer.length.toString(),
                },
            })
        } catch (error) {
            console.error("File reading or PDF generation error:", error)
            return NextResponse.json({ error: "Failed to read file from storage" }, { status: 500 })
        }
    } catch (error) {
        console.error("Export error:", error)
        return NextResponse.json({ error: "Failed to process export" }, { status: 500 })
    }
}

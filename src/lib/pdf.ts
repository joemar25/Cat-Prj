// src/lib/pdf.ts
import { jsPDF } from "jspdf"
import { CertifiedCopy } from "@prisma/client"

type CertifiedCopyData = CertifiedCopy

export async function generateCertifiedCopy(data: CertifiedCopyData): Promise<Buffer> {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        })

        // Set initial font styles
        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)

        // Add header
        doc.text("CERTIFIED TRUE COPY", doc.internal.pageSize.width / 2, 20, { align: "center" })

        // Reset font for body
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)

        // Add content
        let y = 40
        const leftMargin = 20
        const lineHeight = 8

        // 20mm margins on each side
        const maxWidth = doc.internal.pageSize.width - 40

        const addField = (label: string, value: any) => {
            if (value != null && value !== "") {
                // Format dates
                if (value instanceof Date) {
                    value = value.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                }

                // Format numbers
                if (typeof value === 'number') {
                    value = value.toLocaleString()
                }

                const text = `${label}: ${value}`
                const lines = doc.splitTextToSize(text, maxWidth)

                doc.text(lines, leftMargin, y)
                y += lineHeight * lines.length
            }
        }

        // Add all fields with proper formatting
        addField("LCRO Number", data.lcrNo)
        addField("Book Number", data.bookNo)
        addField("Page Number", data.pageNo)
        addField("Searched By", data.searchedBy)
        addField("Contact Number", data.contactNo)
        addField("Date", data.date)
        addField("Address", data.address)
        addField("Amount Paid", data.amountPaid ? `₱${data.amountPaid.toFixed(2)}` : null)
        addField("OR Number", data.orNumber)
        addField("Purpose", data.purpose)
        addField("Registered Date", data.registeredDate)
        addField("Is Registered", data.isRegistered ? "Yes" : "No")
        addField("Relationship To Owner", data.relationshipToOwner)
        addField("Requester Name", data.requesterName)
        addField("Date Paid", data.datePaid)

        // Add remarks if present
        if (data.remarks) {
            y += lineHeight
            doc.setFont("helvetica", "bold")
            doc.text("Remarks:", leftMargin, y)
            y += lineHeight
            doc.setFont("helvetica", "normal")
            const remarkLines = doc.splitTextToSize(data.remarks, maxWidth)
            doc.text(remarkLines, leftMargin, y)
            y += lineHeight * remarkLines.length
        }

        // Add signature section
        if (data.signature) {
            y += lineHeight * 2
            doc.setFont("helvetica", "bold")
            doc.text("Signature:", leftMargin, y)
            y += lineHeight
            doc.setFont("helvetica", "normal")
            doc.text(data.signature, leftMargin, y)
        }

        // Add certification line
        y += lineHeight * 2
        doc.setFont("helvetica", "bold")
        doc.text("Certified by:", leftMargin, y)
        y += lineHeight * 3
        doc.line(leftMargin, y, leftMargin + 60, y)

        // Add footer with dates
        const footerY = doc.internal.pageSize.height - 15
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")

        // Add creation date
        doc.text(`Created: ${data.createdAt.toLocaleDateString()}`, leftMargin, footerY)

        // Add update date if different from creation date
        if (data.updatedAt.getTime() !== data.createdAt.getTime()) {
            doc.text(`Last Updated: ${data.updatedAt.toLocaleDateString()}`, leftMargin, footerY + 5)
        }

        // Add generation timestamp on the right
        const generatedText = `Generated on ${new Date().toLocaleString()}`
        const textWidth = doc.getTextWidth(generatedText)
        doc.text(generatedText, doc.internal.pageSize.width - leftMargin - textWidth, footerY)

        // Convert to buffer
        return Buffer.from(doc.output("arraybuffer"))
    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF")
    }
}
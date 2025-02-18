import { jsPDF } from "jspdf"
import { CertifiedCopy } from "@prisma/client"

type CertifiedCopyData = CertifiedCopy & {
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
}

export async function generateCertifiedCopy(data: CertifiedCopyData): Promise<Buffer> {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "LEGAL"
        })

        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)

        const currentDate = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        doc.text("Republic of the Philippines", doc.internal.pageSize.width / 2, 20, { align: "center" })
        doc.text("CITY CIVIL REGISTRY", doc.internal.pageSize.width / 2, 30, { align: "center" })
        doc.text(currentDate, doc.internal.pageSize.width / 2, 40, { align: "center" })

        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)

        doc.text("TO WHOM IT MAY CONCERN:", 20, 60)

        let y = 70
        const leftMargin = 25
        const lineHeight = 10
        const labelWidth = 60
        const valueWidth = 120
        const underlineOffset = 1
        

        const underlineText = (label: string, value: string | number | null | undefined) => {
            doc.text(label, leftMargin, y)
            const labelWidth = doc.getTextWidth(label + ' ')
            if (value !== undefined && value !== null && value !== 'N/A' && value !== '₱0.00') {
                const valueStr = value.toString()
                doc.text(valueStr, leftMargin + labelWidth, y)
                doc.line(leftMargin + labelWidth, y + 1, leftMargin + labelWidth + doc.getTextWidth(valueStr), y + 1)
            } else {
                doc.line(leftMargin + labelWidth, y + 1, leftMargin + labelWidth + 40, y + 1)
            }
            y += lineHeight
        }

        const concat = (label: string, value: string, label2: string, value2: string) => {
            let currentX = leftMargin
        
            // Render the first label
            doc.text(label, currentX, y)
            currentX += doc.getTextWidth(label) + 2 // Move X after label
        
            // Render the first underlined value
            if (value) {
                doc.text(value, currentX, y) 
                const valueWidth = doc.getTextWidth(value)
                doc.line(currentX, y + 2, currentX + valueWidth, y + 2) // Underline
                currentX += valueWidth + 10 // Move X after value (extra spacing)
            }
        
            // Render the second label
            doc.text(label2, currentX, y)
            currentX += doc.getTextWidth(label2) + 2 // Move X after second label
        
            // Render the second underlined value
            if (value2) {
                doc.text(value2, currentX, y) 
                const value2Width = doc.getTextWidth(value2)
                doc.line(currentX, y + 2, currentX + value2Width, y + 2) // Underline
            }
        
            y += lineHeight + 1 // Move to the next line
        }
        
       
        

        const partialUnderlineText = (prefix: string, value: string | number | null | undefined, suffix: string) => {
            doc.text(prefix, leftMargin, y)
            const prefixWidth = doc.getTextWidth(prefix + ' ')
            if (value !== undefined && value !== null) {
                const valueStr = value.toString()
                doc.text(valueStr, leftMargin + prefixWidth, y)
                doc.line(leftMargin + prefixWidth, y + 1, leftMargin + prefixWidth + doc.getTextWidth(valueStr), y + 1)
                const valueWidth = doc.getTextWidth(valueStr + ' ')
                doc.text(suffix, leftMargin + prefixWidth + valueWidth, y)
            } else {
                doc.line(leftMargin + prefixWidth, y + 1, leftMargin + prefixWidth + 40, y + 1)
                doc.text(suffix, leftMargin + prefixWidth + 42, y)
            }
            y += lineHeight
        }

        // Helper function for field rendering
        const renderField = (label: string, value: any) => {
            doc.text(label, leftMargin, y)
            doc.text(":", leftMargin + labelWidth - 5, y)
            const valueX = leftMargin + labelWidth + 5
            if (value) {
                const valueStr = value.toString()
                doc.text(valueStr, valueX, y)
                doc.line(valueX, y + underlineOffset, valueX + valueWidth, y + underlineOffset)
            } else {
                doc.line(valueX, y + underlineOffset, valueX + valueWidth, y + underlineOffset)
            }
            y += lineHeight
        }

        const underlinePageBookText = (prefix: string, page: string | number | null | undefined, book: string | number | null | undefined, suffix: string) => {
            doc.text(prefix, leftMargin, y)
            let currentX = leftMargin + doc.getTextWidth(prefix + ' ')

            const pageStr = page !== null && page !== undefined ? page.toString() : ''
            doc.text(pageStr, currentX, y)
            doc.line(currentX, y + 1, currentX + (pageStr ? doc.getTextWidth(pageStr) : 40), y + 1)
            currentX += doc.getTextWidth(pageStr + ' ')

            doc.text('book number', currentX, y)
            currentX += doc.getTextWidth('book number ')

            const bookStr = book !== null && book !== undefined ? book.toString() : ''
            doc.text(bookStr, currentX, y)
            doc.line(currentX, y + 1, currentX + (bookStr ? doc.getTextWidth(bookStr) : 40), y + 1)

            currentX += doc.getTextWidth(bookStr)
            doc.text(suffix, currentX, y)
            y += lineHeight
        }

        if (data.form) {
            if (data.form.formType === 'FORM_1A' && data.form.birthForm) {
                underlinePageBookText('We certify that the following birth appears in our Register of Births on page ', data.pageNo, data.bookNo, ':')

                renderField("Registry Number:", data.lcrNo)
                renderField("Date of Registration:", data.form.birthForm.dateOfBirth.toLocaleDateString())
                renderField("Name of Child:", data.form.birthForm.nameOfChild)
                renderField("Sex:", data.form.birthForm.sex)
                renderField("Date of Birth:", data.form.birthForm.dateOfBirth.toLocaleDateString())
                renderField("Place of Birth:", data.form.birthForm.placeOfBirth)
                renderField("Name of Mother:", data.form.birthForm.nameOfMother)
                renderField("Citizenship of Mother:", data.form.birthForm.citizenshipMother)
                renderField("Name of Father:", data.form.birthForm.nameOfFather)
                renderField("Citizenship of Father:", data.form.birthForm.citizenshipFather)

                if (data.form.birthForm.dateMarriageParents) {
                    renderField("Date of Marriage of Parents:", data.form.birthForm.dateMarriageParents.toLocaleDateString())
                    renderField("Place of Marriage of Parents:", data.form.birthForm.placeMarriageParents)
                } else {
                    renderField("Date of Marriage of Parents:", undefined)
                    renderField("Place of Marriage of Parents:", undefined)
                }
            }

            else if (data.form.formType === 'FORM_2A' && data.form.deathForm) {
                underlinePageBookText('We certify that the following death appears in our Register of Deaths on page', data.pageNo, data.bookNo, ':')

                renderField("Registry Number:", data.lcrNo)
                renderField("Date of Registration:", data.date?.toLocaleDateString())
                renderField("Name of Deceased:", data.form.deathForm.nameOfDeceased)
                renderField("Sex:", data.form.deathForm.sex)
                renderField("Age:", data.form.deathForm.age)
                renderField("Civil Status:", data.form.deathForm.civilStatus)
                renderField("Citizenship:", data.form.deathForm.citizenship)
                renderField("Date of Death:", data.form.deathForm.dateOfDeath.toLocaleDateString())
                renderField("Place of Death:", data.form.deathForm.placeOfDeath)
                renderField("Cause of Death:", data.form.deathForm.causeOfDeath)
            }

            else if (data.form.formType === 'FORM_3A' && data.form.marriageForm) {
                underlinePageBookText('We certify that the following marriage appears in our Register of Marriages on page', data.pageNo, data.bookNo, ':')

                doc.setFont("helvetica", "bold")
                doc.text("HUSBAND", leftMargin + 40, y)
                doc.text("WIFE", leftMargin + 120, y)
                y += lineHeight

                doc.setFont("helvetica", "normal")
                const marriageFields = [
                    ["Name:", data.form.marriageForm.husbandName, data.form.marriageForm.wifeName],
                    ["Date of Birth/Age:", data.form.marriageForm.husbandDateOfBirthAge, data.form.marriageForm.wifeDateOfBirthAge],
                    ["Citizenship:", data.form.marriageForm.husbandCitizenship, data.form.marriageForm.wifeCitizenship],
                    ["Civil Status:", data.form.marriageForm.husbandCivilStatus, data.form.marriageForm.wifeCivilStatus],
                    ["Father:", data.form.marriageForm.husbandFather, data.form.marriageForm.wifeFather],
                    ["Mother:", data.form.marriageForm.husbandMother, data.form.marriageForm.wifeMother]
                ]

                marriageFields.forEach(([label, husbandValue, wifeValue]) => {
                    doc.text(label, leftMargin, y)
                    const husbandWidth = doc.getTextWidth(husbandValue)
                    const wifeWidth = doc.getTextWidth(wifeValue)

                    if (husbandValue) {
                        doc.text(husbandValue, leftMargin + 40, y)
                        doc.line(leftMargin + 40, y + 1, leftMargin + 40 + husbandWidth, y + 1)
                    } else {
                        doc.line(leftMargin + 40, y + 1, leftMargin + 80, y + 1)
                    }

                    if (wifeValue) {
                        doc.text(wifeValue, leftMargin + 120, y)
                        doc.line(leftMargin + 120, y + 1, leftMargin + 120 + wifeWidth, y + 1)
                    } else {
                        doc.line(leftMargin + 120, y + 1, leftMargin + 160, y + 1)
                    }
                    y += lineHeight
                })

                y += lineHeight
                renderField("Date of Marriage:", data.form.marriageForm.dateOfMarriage.toLocaleDateString())
                renderField("Place of Marriage:", data.form.marriageForm.placeOfMarriage)
            }

            y += lineHeight + 1
             // Move down before rendering
        y += lineHeight + 1 
        
        // Example usage
        concat("This certification is issued to ", data.requesterName, " upon his/her request for ", data.purpose)

            y += lineHeight + 1
            doc.text("Prepared by:", leftMargin, y)
            doc.text("Verified by:", doc.internal.pageSize.width / 2, y)

            y += lineHeight + 1
            doc.setFont("helvetica", "bold")
            doc.text(data.form.preparedByName, leftMargin, y)
            doc.text(data.form.verifiedByName, doc.internal.pageSize.width / 2, y)

            y += lineHeight
            doc.setFont("helvetica", "normal")
            doc.text(data.form.preparedByPosition, leftMargin, y)
            doc.text(data.form.verifiedByPosition, doc.internal.pageSize.width / 2, y)

            y += lineHeight + 1
            doc.setFont("helvetica", "bold")
            doc.text(data.form.civilRegistrar, doc.internal.pageSize.width / 2, y, { align: "center" })
            y += lineHeight + 1
            doc.setFont("helvetica", "normal")
            doc.text(data.form.civilRegistrarPosition, doc.internal.pageSize.width / 2, y, { align: "center" })

            y += lineHeight + 1
            renderField("Amount Paid:", data.amountPaid && data.amountPaid > 0 ? `₱${data.amountPaid.toFixed(2)}` : undefined)
            renderField("O.R. Number:", data.orNumber || undefined)
            renderField("Date Paid:", data.datePaid?.toLocaleDateString() || undefined)
        }

        return Buffer.from(doc.output("arraybuffer"))
    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF")
    }
}

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
            format: "a4"
        })

        doc.setFont("helvetica", "bold")
        doc.setFontSize(16)

        const currentDate = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })

        doc.text("Republic of the Philippines", doc.internal.pageSize.width / 2, 20, { align: "center" })
        doc.text("CITY CIVIL REGISTRY", doc.internal.pageSize.width / 2, 30, { align: "center" })
        doc.text(currentDate, doc.internal.pageSize.width / 2, 40, { align: "center" })

        doc.setFont("helvetica", "normal")
        doc.setFontSize(12)

        doc.text("TO WHOM IT MAY CONCERN:", 20, 60)

        let y = 70
        const leftMargin = 20
        const lineHeight = 8

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
                underlinePageBookText('We certify that the following birth appears in our Register of Births on page', data.pageNo, data.bookNo, ':')

                underlineText("Registry Number:", data.lcrNo)
                underlineText("Date of Registration:", data.form.birthForm.dateOfBirth.toLocaleDateString())
                underlineText("Name of Child:", data.form.birthForm.nameOfChild)
                underlineText("Sex:", data.form.birthForm.sex)
                underlineText("Date of Birth:", data.form.birthForm.dateOfBirth.toLocaleDateString())
                underlineText("Place of Birth:", data.form.birthForm.placeOfBirth)
                underlineText("Name of Mother:", data.form.birthForm.nameOfMother)
                underlineText("Citizenship of Mother:", data.form.birthForm.citizenshipMother)
                underlineText("Name of Father:", data.form.birthForm.nameOfFather)
                underlineText("Citizenship of Father:", data.form.birthForm.citizenshipFather)

                if (data.form.birthForm.dateMarriageParents) {
                    underlineText("Date of Marriage of Parents:", data.form.birthForm.dateMarriageParents.toLocaleDateString())
                    underlineText("Place of Marriage of Parents:", data.form.birthForm.placeMarriageParents)
                } else {
                    underlineText("Date of Marriage of Parents:", undefined)
                    underlineText("Place of Marriage of Parents:", undefined)
                }
            }

            else if (data.form.formType === 'FORM_2A' && data.form.deathForm) {
                underlinePageBookText('We certify that the following death appears in our Register of Deaths on page', data.pageNo, data.bookNo, ':')

                underlineText("Registry Number:", data.lcrNo)
                underlineText("Date of Registration:", data.date?.toLocaleDateString())
                underlineText("Name of Deceased:", data.form.deathForm.nameOfDeceased)
                underlineText("Sex:", data.form.deathForm.sex)
                underlineText("Age:", data.form.deathForm.age)
                underlineText("Civil Status:", data.form.deathForm.civilStatus)
                underlineText("Citizenship:", data.form.deathForm.citizenship)
                underlineText("Date of Death:", data.form.deathForm.dateOfDeath.toLocaleDateString())
                underlineText("Place of Death:", data.form.deathForm.placeOfDeath)
                underlineText("Cause of Death:", data.form.deathForm.causeOfDeath)
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
                underlineText("Date of Marriage:", data.form.marriageForm.dateOfMarriage.toLocaleDateString())
                underlineText("Place of Marriage:", data.form.marriageForm.placeOfMarriage)
            }

            y += lineHeight + 1
            partialUnderlineText("This certification is issued to", data.requesterName, ` upon his/her request for `)
            partialUnderlineText("", data.purpose, ".")

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
            underlineText("Amount Paid:", data.amountPaid && data.amountPaid > 0 ? `₱${data.amountPaid.toFixed(2)}` : undefined)
            underlineText("O.R. Number:", data.orNumber || undefined)
            underlineText("Date Paid:", data.datePaid?.toLocaleDateString() || undefined)
        }

        return Buffer.from(doc.output("arraybuffer"))
    } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF")
    }
}

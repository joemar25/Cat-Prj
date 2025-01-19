// src/app/api/public-requests/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requestSchema } from '@/lib/validation/forms/request'
import { CivilRegistryFormType, Prisma } from '@prisma/client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedRequest = requestSchema.parse(body)

        const getCivilRegistryFormType = (type: typeof validatedRequest.type): CivilRegistryFormType => {
            const mapping = {
                'BIRTH': 'FORM_1A',
                'DEATH': 'FORM_2A',
                'MARRIAGE': 'FORM_3A'
            } as const
            return mapping[type]
        }

        // Create base form with required fields from schema
        const baseFormData: Prisma.CivilRegistryFormBaseCreateInput = {
            formType: getCivilRegistryFormType(validatedRequest.type),
            registryNumber: `${validatedRequest.type}-${Date.now()}`,
            pageNumber: '1',
            bookNumber: '1',
            dateOfRegistration: new Date(),
            issuedTo: validatedRequest.data.requesterName,
            purpose: validatedRequest.data.purpose,
            civilRegistrar: 'Pending Assignment',
            civilRegistrarPosition: 'Civil Registrar',
            amountPaid: 0
        }

        // Create base form using transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            const baseForm = await tx.civilRegistryFormBase.create({
                data: baseFormData
            })

            switch (validatedRequest.type) {
                case 'BIRTH': {
                    await tx.civilRegistryForm1A.create({
                        data: {
                            baseFormId: baseForm.id,
                            nameOfChild: validatedRequest.data.nameOfChild,
                            sex: validatedRequest.data.sex,
                            dateOfBirth: new Date(validatedRequest.data.dateOfBirth),
                            placeOfBirth: validatedRequest.data.placeOfBirth,
                            nameOfMother: validatedRequest.data.nameOfMother,
                            citizenshipMother: validatedRequest.data.citizenshipMother,
                            nameOfFather: validatedRequest.data.nameOfFather,
                            citizenshipFather: validatedRequest.data.citizenshipFather,
                            dateMarriageParents: validatedRequest.data.dateMarriageParents
                                ? new Date(validatedRequest.data.dateMarriageParents)
                                : null,
                            placeMarriageParents: validatedRequest.data.placeMarriageParents || null
                        }
                    })
                    break
                }
                case 'DEATH': {
                    await tx.civilRegistryForm2A.create({
                        data: {
                            baseFormId: baseForm.id,
                            nameOfDeceased: validatedRequest.data.nameOfDeceased,
                            sex: validatedRequest.data.sex,
                            age: validatedRequest.data.age,
                            civilStatus: validatedRequest.data.civilStatus,
                            citizenship: validatedRequest.data.citizenship,
                            dateOfDeath: new Date(validatedRequest.data.dateOfDeath),
                            placeOfDeath: validatedRequest.data.placeOfDeath,
                            causeOfDeath: validatedRequest.data.causeOfDeath
                        }
                    })
                    break
                }
                case 'MARRIAGE': {
                    await tx.civilRegistryForm3A.create({
                        data: {
                            baseFormId: baseForm.id,
                            husbandName: validatedRequest.data.husbandName,
                            husbandDateOfBirthAge: validatedRequest.data.husbandDateOfBirthAge,
                            husbandCitizenship: validatedRequest.data.husbandCitizenship,
                            husbandCivilStatus: validatedRequest.data.husbandCivilStatus,
                            husbandMother: validatedRequest.data.husbandMother,
                            husbandFather: validatedRequest.data.husbandFather,
                            wifeName: validatedRequest.data.wifeName,
                            wifeDateOfBirthAge: validatedRequest.data.wifeDateOfBirthAge,
                            wifeCitizenship: validatedRequest.data.wifeCitizenship,
                            wifeCivilStatus: validatedRequest.data.wifeCivilStatus,
                            wifeMother: validatedRequest.data.wifeMother,
                            wifeFather: validatedRequest.data.wifeFather,
                            dateOfMarriage: new Date(validatedRequest.data.dateOfMarriage),
                            placeOfMarriage: validatedRequest.data.placeOfMarriage
                        }
                    })
                    break
                }
            }

            return baseForm
        })

        return NextResponse.json({
            message: 'Request submitted successfully',
            registryNumber: result.registryNumber
        })
    } catch (error) {
        console.error('Error processing request:', error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json(
                { error: 'Database error occurred' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        )
    }
}
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
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

        const baseFormData: Prisma.CivilRegistryFormBaseCreateInput = {
            formType: getCivilRegistryFormType(validatedRequest.type),
            registryNumber: `${validatedRequest.type}-${Date.now()}`,
            pageNumber: validatedRequest.data.pageNo || '1',
            bookNumber: validatedRequest.data.bookNo || '1',
            dateOfRegistration: validatedRequest.data.date,
            issuedTo: validatedRequest.data.requesterName,
            purpose: validatedRequest.data.purpose,
            civilRegistrar: 'Pending Assignment',
            civilRegistrarPosition: 'Civil Registrar',
            amountPaid: validatedRequest.data.feesPaid || 0,
            orNumber: validatedRequest.data.orNumber || null,
            datePaid: validatedRequest.data.datePaid ? new Date(validatedRequest.data.datePaid) : null,
            isRegisteredLate: validatedRequest.data.isRegisteredLate || false,
            copies: validatedRequest.data.copies || 0,
        }

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
                            dateOfBirth: new Date(validatedRequest.data.dateOfBirth),
                            placeOfBirth: validatedRequest.data.placeOfBirth,
                            nameOfMother: validatedRequest.data.nameOfMother,
                            nameOfFather: validatedRequest.data.nameOfFather,
                        }
                    })
                    break
                }
                case 'DEATH': {
                    await tx.civilRegistryForm2A.create({
                        data: {
                            baseFormId: baseForm.id,
                            nameOfDeceased: validatedRequest.data.nameOfDeceased,
                            dateOfDeath: new Date(validatedRequest.data.dateOfDeath),
                            placeOfDeath: validatedRequest.data.placeOfDeath,
                        }
                    })
                    break
                }
                case 'MARRIAGE': {
                    await tx.civilRegistryForm3A.create({
                        data: {
                            baseFormId: baseForm.id,
                            husbandName: validatedRequest.data.husbandName,
                            wifeName: validatedRequest.data.wifeMaidenName,
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
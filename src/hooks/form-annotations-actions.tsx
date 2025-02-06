// src/hooks/form-annotations-actions.tsx
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CertifiedCopyStatus } from '@prisma/client'
import { deathAnnotationSchema, DeathAnnotationFormValues } from '@/lib/types/zod-form-annotations/death-annotation-form-schema'
import { BirthAnnotationFormValues } from '@/lib/types/zod-form-annotations/birth-annotation-form-schema'
import { MarriageAnnotationFormValues } from '@/lib/types/zod-form-annotations/marriage-annotation-form-schema'
import { auth } from '@/lib/auth'

// Dummy attachment values
const dummyAttachment = {
  fileUrl: '/assets/default/issued-ctc/dummy.pdf',
  fileName: 'dummy.pdf',
  fileSize: 0,
  mimeType: 'application/pdf',
}

// Helper function to get the current user data from auth
async function getUserData() {
  const session = await auth()
  return { userId: session?.user?.id, userName: session?.user?.name }
}

export async function createDeathAnnotation(data: DeathAnnotationFormValues) {
  try {
    const { userId, userName } = await getUserData()
    const certifiedCopy = await prisma.certifiedCopy.create({
      data: {
        pageNo: data.pageNumber,
        bookNo: data.bookNumber,
        lcrNo: data.registryNumber,
        date: new Date(data.dateOfRegistration),
        purpose: data.purpose,
        remarks: data.remarks,
        requesterName: userName || data.issuedTo,
        amountPaid: data.amountPaid ? data.amountPaid : 0.0,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,
        isRegistered: true,
        registeredDate: new Date(),
        relationshipToOwner: 'N/A',
        address: 'N/A',
        status: CertifiedCopyStatus.PENDING,
        attachment: {
          create: {
            type: 'DEATH_CERTIFICATE',
            ...dummyAttachment,
            userId,
          },
        },
        form: {
          create: {
            formType: 'FORM_2A',
            pageNumber: data.pageNumber,
            bookNumber: data.bookNumber,
            registryNumber: data.registryNumber,
            dateOfRegistration: new Date(data.dateOfRegistration),
            preparedByName: data.preparedByName,
            preparedByPosition: data.preparedByPosition,
            verifiedByName: data.verifiedByName,
            verifiedByPosition: data.verifiedByPosition,
            civilRegistrar: data.civilRegistrar,
            civilRegistrarPosition: data.civilRegistrarPosition,
            purpose: data.purpose,
            deathForm: {
              create: {
                nameOfDeceased: data.nameOfDeceased,
                sex: data.sex,
                age: data.age,
                civilStatus: data.civilStatus,
                citizenship: data.citizenship,
                dateOfDeath: new Date(data.dateOfDeath),
                placeOfDeath: data.placeOfDeath,
                causeOfDeath: data.causeOfDeath,
              },
            },
          },
        },
      },
    })

    revalidatePath('/civil-registry')
    return { success: true, data: certifiedCopy }
  } catch (error) {
    console.error('Error creating death annotation:', error)
    return { success: false, error: 'Failed to create death annotation' }
  }
}

export async function createMarriageAnnotation(data: MarriageAnnotationFormValues) {
  try {
    const { userId, userName } = await getUserData()
    const certifiedCopy = await prisma.certifiedCopy.create({
      data: {
        pageNo: data.pageNumber,
        bookNo: data.bookNumber,
        lcrNo: data.registryNumber,
        date: new Date(data.dateOfRegistration),
        purpose: data.purpose,
        remarks: null,
        requesterName: userName || data.issuedTo,
        amountPaid: data.amountPaid ? data.amountPaid : 0.0,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,
        isRegistered: true,
        registeredDate: new Date(),
        relationshipToOwner: 'N/A',
        address: 'N/A',
        status: CertifiedCopyStatus.PENDING,
        attachment: {
          create: {
            type: 'MARRIAGE_CERTIFICATE',
            ...dummyAttachment,
            userId,
          },
        },
        form: {
          create: {
            formType: 'FORM_3A',
            pageNumber: data.pageNumber,
            bookNumber: data.bookNumber,
            registryNumber: data.registryNumber,
            dateOfRegistration: new Date(data.dateOfRegistration),
            preparedByName: data.preparedByName,
            preparedByPosition: data.preparedByPosition,
            verifiedByName: data.verifiedByName,
            verifiedByPosition: data.verifiedByPosition,
            civilRegistrar: data.civilRegistrar,
            civilRegistrarPosition: data.civilRegistrarPosition,
            purpose: data.purpose,
            marriageForm: {
              create: {
                husbandName: data.husbandName,
                husbandDateOfBirthAge: data.husbandDateOfBirthAge,
                husbandCitizenship: data.husbandCitizenship,
                husbandCivilStatus: data.husbandCivilStatus,
                husbandMother: data.husbandMother,
                husbandFather: data.husbandFather,
                wifeName: data.wifeName,
                wifeDateOfBirthAge: data.wifeDateOfBirthAge,
                wifeCitizenship: data.wifeCitizenship,
                wifeCivilStatus: data.wifeCivilStatus,
                wifeMother: data.wifeMother,
                wifeFather: data.wifeFather,
                dateOfMarriage: new Date(data.dateOfMarriage),
                placeOfMarriage: data.placeOfMarriage,
              },
            },
          },
        },
      },
    })

    revalidatePath('/civil-registry')
    return { success: true, data: certifiedCopy }
  } catch (error) {
    console.error('Error creating marriage annotation:', error)
    return { success: false, error: 'Failed to create marriage annotation' }
  }
}

export async function createBirthAnnotation(data: BirthAnnotationFormValues) {
  try {
    const { userId, userName } = await getUserData()
    const certifiedCopy = await prisma.certifiedCopy.create({
      data: {
        pageNo: data.pageNumber,
        bookNo: data.bookNumber,
        lcrNo: data.registryNumber,
        date: new Date(data.dateOfRegistration),
        purpose: 'Birth Certification',
        remarks: data.remarks,
        requesterName: userName || `${data.childFirstName} ${data.childLastName}`,
        amountPaid: 0.0,
        orNumber: '',
        datePaid: null,
        isRegistered: true,
        registeredDate: new Date(),
        relationshipToOwner: 'N/A',
        address: 'N/A',
        status: CertifiedCopyStatus.PENDING,
        attachment: {
          create: {
            type: 'BIRTH_CERTIFICATE',
            ...dummyAttachment,
            userId,
          },
        },
        form: {
          create: {
            formType: 'FORM_1A',
            pageNumber: data.pageNumber,
            bookNumber: data.bookNumber,
            registryNumber: data.registryNumber,
            dateOfRegistration: new Date(data.dateOfRegistration),
            preparedByName: data.preparedBy,
            preparedByPosition: data.preparedByPosition,
            verifiedByName: data.verifiedBy,
            verifiedByPosition: data.verifiedByPosition,
            civilRegistrar: 'Priscilla L. Galicia',
            civilRegistrarPosition: 'OIC - City Civil Registrar',
            purpose: 'Birth Certification',
            birthForm: {
              create: {
                nameOfChild: `${data.childFirstName} ${data.childMiddleName || ''} ${data.childLastName}`.trim(),
                sex: data.sex,
                dateOfBirth: new Date(data.dateOfBirth),
                placeOfBirth: data.placeOfBirth,
                nameOfMother: data.motherName,
                citizenshipMother: data.motherCitizenship,
                nameOfFather: data.fatherName,
                citizenshipFather: data.fatherCitizenship,
                dateMarriageParents: data.parentsMarriageDate ? new Date(data.parentsMarriageDate) : null,
                placeMarriageParents: data.parentsMarriagePlace || null,
              },
            },
          },
        },
      },
    })

    revalidatePath('/civil-registry')
    return { success: true, data: certifiedCopy }
  } catch (error) {
    console.error('Error creating birth annotation:', error)
    return { success: false, error: 'Failed to create birth annotation' }
  }
}

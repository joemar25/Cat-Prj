// src/hooks/form-annotations-actions.tsx
'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CertifiedCopyStatus, Sex } from '@prisma/client'
import { DeathAnnotationFormValues } from '@/lib/types/zod-form-annotations/death-annotation-form-schema'
import { BirthAnnotationFormValues } from '@/lib/types/zod-form-annotations/birth-annotation-form-schema'
import { MarriageAnnotationFormValues } from '@/lib/types/zod-form-annotations/marriage-annotation-form-schema'

async function getUserData() {
  const session = await auth()
  return { userId: session?.user?.id, userName: session?.user?.name }
}

export async function createDeathAnnotation(data: DeathAnnotationFormValues, certifiedCopyId: string) {
  try {
    const { userName } = await getUserData()

    const civilRegistryForm = await prisma.civilRegistryFormBase.create({
      data: {
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
        issuedTo: userName || data.issuedTo,
        amountPaid: data.amountPaid ?? 0.0,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,
        CertifiedCopy: {
          connect: { id: certifiedCopyId }
        },
        deathForm: {
          create: {
            nameOfDeceased: data.nameOfDeceased,
            sex: data.sex as unknown as Sex,
            age: data.age,
            civilStatus: data.civilStatus,
            citizenship: data.citizenship,
            dateOfDeath: new Date(data.dateOfDeath),
            placeOfDeath: data.placeOfDeath,
            causeOfDeath: data.causeOfDeath,
          },
        },
      },
      include: {
        deathForm: true,
        CertifiedCopy: true
      }
    })

    // Update the Certified Copy to link to the new form
    await prisma.certifiedCopy.update({
      where: { id: certifiedCopyId },
      data: {
        formId: civilRegistryForm.id,
        status: CertifiedCopyStatus.COMPLETED
      }
    })

    revalidatePath('/civil-registry')
    return { success: true, data: civilRegistryForm }
  } catch (error) {
    console.error('Error creating death annotation:', error)
    return { success: false, error: 'Failed to create death annotation' }
  }
}

export async function createMarriageAnnotation(data: MarriageAnnotationFormValues, certifiedCopyId: string) {
  try {
    const { userName } = await getUserData()

    const civilRegistryForm = await prisma.civilRegistryFormBase.create({
      data: {
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
        issuedTo: userName || data.issuedTo,
        amountPaid: data.amountPaid ?? 0.0,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,
        CertifiedCopy: {
          connect: { id: certifiedCopyId }
        },
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
      include: {
        marriageForm: true,
        CertifiedCopy: true
      }
    })

    // Update the Certified Copy to link to the new form
    await prisma.certifiedCopy.update({
      where: { id: certifiedCopyId },
      data: {
        formId: civilRegistryForm.id,
        status: CertifiedCopyStatus.COMPLETED
      }
    })

    revalidatePath('/civil-registry')
    return { success: true, data: civilRegistryForm }
  } catch (error) {
    console.error('Error creating marriage annotation:', error)
    return { success: false, error: 'Failed to create marriage annotation' }
  }
}

export async function createBirthAnnotation(data: BirthAnnotationFormValues, certifiedCopyId: string) {
  try {
    // Add validation for input parameters
    if (!data || !certifiedCopyId) {
      throw new Error('Missing required data or certifiedCopyId');
    }

    console.log('Received data:', data);
    console.log('Received certifiedCopyId:', certifiedCopyId);

    const { userName } = await getUserData();

    // Validate that we have the minimum required data
    if (!data.childFirstName || !data.childLastName || !data.dateOfBirth ||
      !data.placeOfBirth || !data.motherName || !data.fatherName) {
      throw new Error('Missing required birth certificate fields');
    }

    const civilRegistryForm = await prisma.civilRegistryFormBase.create({
      data: {
        formType: 'FORM_1A',
        pageNumber: data.pageNumber || '',
        bookNumber: data.bookNumber || '',
        registryNumber: data.registryNumber || '',
        dateOfRegistration: data.dateOfRegistration ? new Date(data.dateOfRegistration) : new Date(),
        preparedByName: data.preparedBy || userName || '',
        preparedByPosition: data.preparedByPosition || '',
        verifiedByName: data.verifiedBy || '',
        verifiedByPosition: data.verifiedByPosition || '',
        civilRegistrar: 'Priscilla L. Galicia',
        civilRegistrarPosition: 'OIC - City Civil Registrar',
        purpose: 'Birth Certification',
        issuedTo: userName || `${data.childFirstName} ${data.childLastName}`,
        birthForm: {
          create: {
            nameOfChild: `${data.childFirstName} ${data.childMiddleName || ''} ${data.childLastName}`.trim(),
            sex: data.sex as Sex || null,
            dateOfBirth: new Date(data.dateOfBirth),
            placeOfBirth: data.placeOfBirth,
            nameOfMother: data.motherName,
            citizenshipMother: data.motherCitizenship || '',
            nameOfFather: data.fatherName,
            citizenshipFather: data.fatherCitizenship || '',
            dateMarriageParents: data.parentsMarriageDate ? new Date(data.parentsMarriageDate) : null,
            placeMarriageParents: data.parentsMarriagePlace || null,
          }
        },
        CertifiedCopy: {
          connect: {
            id: certifiedCopyId
          }
        }
      },
      include: {
        birthForm: true,
        CertifiedCopy: true
      }
    });

    if (!civilRegistryForm) {
      throw new Error('Failed to create civil registry form');
    }

    // Update the Certified Copy status
    await prisma.certifiedCopy.update({
      where: { id: certifiedCopyId },
      data: {
        formId: civilRegistryForm.id,
        status: CertifiedCopyStatus.COMPLETED
      }
    });

    revalidatePath('/civil-registry');
    return { success: true, data: civilRegistryForm };

  } catch (error) {
    console.error('Error creating birth annotation:', {
      error,
      data,
      certifiedCopyId,
      stack: error instanceof Error ? error.stack : undefined
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create birth annotation',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
}
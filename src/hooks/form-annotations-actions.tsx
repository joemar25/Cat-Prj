// src\hooks\form-annotations-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import {
  DeathAnnotationFormValues,
  MarriageAnnotationFormValues,
} from '@/lib/types/zod-form-annotations/formSchemaAnnotation';

import { revalidatePath } from 'next/cache';
export async function createDeathAnnotation(data: DeathAnnotationFormValues) {
  try {
    const baseForm = await prisma.civilRegistryFormBase.create({
      data: {
        formType: 'FORM_2A',
        pageNumber: data.pageNumber,
        bookNumber: data.bookNumber,
        registryNumber: data.registryNumber,
        dateOfRegistration: new Date(data.dateOfRegistration),
        issuedTo: data.issuedTo,
        purpose: data.purpose,
        remarks: data.remarks,
        preparedByName: data.preparedByName,
        preparedByPosition: data.preparedByPosition,
        verifiedByName: data.verifiedByName,
        verifiedByPosition: data.verifiedByPosition,
        civilRegistrar: data.civilRegistrar,
        civilRegistrarPosition: data.civilRegistrarPosition,
        amountPaid: data.amountPaid,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,

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
    });

    revalidatePath('/civil-registry');
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating death annotation:', error);
    return { success: false, error: 'Failed to create death annotation' };
  }
}

export async function createMarriageAnnotation(
  data: MarriageAnnotationFormValues
) {
  try {
    const baseForm = await prisma.civilRegistryFormBase.create({
      data: {
        formType: 'FORM_3A',
        pageNumber: data.pageNumber,
        bookNumber: data.bookNumber,
        registryNumber: data.registryNumber,
        dateOfRegistration: new Date(data.dateOfRegistration),
        issuedTo: data.issuedTo,
        purpose: data.purpose,
        remarks: null,
        preparedByName: data.preparedByName,
        preparedByPosition: data.preparedByPosition,
        verifiedByName: data.verifiedByName,
        verifiedByPosition: data.verifiedByPosition,
        civilRegistrar: data.civilRegistrar,
        civilRegistrarPosition: data.civilRegistrarPosition,
        amountPaid: data.amountPaid,
        orNumber: data.orNumber,
        datePaid: data.datePaid ? new Date(data.datePaid) : null,

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
    });

    revalidatePath('/civil-registry');
    return { success: true, data: baseForm };
  } catch (error) {
    console.error('Error creating marriage annotation:', error);
    return { success: false, error: 'Failed to create marriage annotation' };
  }
}

// src\hooks\form-annotations-actions.tsx
'use server';

import { prisma } from '@/lib/prisma';
import { DeathAnnotationFormValues } from '@/lib/types/zod-form-annotations/formSchemaAnnotation';

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

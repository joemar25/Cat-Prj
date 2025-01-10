// src/app/_actions/civil-registry.ts
'use server';

import { prisma } from '@/lib/prisma';
import { BaseRegistryForm, FormType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type BaseRegistryFormWithRelations = BaseRegistryForm & {
  preparedBy: { name: string } | null;
  verifiedBy: { name: string } | null;
};

export async function deleteBaseRegistryForm(formId: string) {
  try {
    await prisma.baseRegistryForm.delete({
      where: { id: formId },
    });

    revalidatePath('/civil-registry');
    return { success: true, message: 'Form deleted successfully' };
  } catch (error) {
    console.error('Error deleting civil registry form:', error);
    return { success: false, message: 'Failed to delete form' };
  }
}

export async function updateBaseRegistryForm(
  formId: string,
  data: Partial<BaseRegistryForm>
): Promise<{
  success: boolean;
  message: string;
  data?: BaseRegistryFormWithRelations;
}> {
  try {
    const updatedForm = await prisma.baseRegistryForm.update({
      where: { id: formId },
      data,
      include: {
        preparedBy: {
          select: { name: true },
        },
        verifiedBy: {
          select: { name: true },
        },
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      message: 'Form updated successfully',
      data: updatedForm as BaseRegistryFormWithRelations,
    };
  } catch (error) {
    console.error('Error updating civil registry form:', error);
    return { success: false, message: 'Failed to update form' };
  }
}

export async function addBaseRegistryForm(data: {
  formType: FormType;
  registryNumber: string;
  province: string;
  cityMunicipality: string;
  pageNumber: string;
  bookNumber: string;
  dateOfRegistration: Date;
  formNumber: string;
}) {
  try {
    const baseForm = await prisma.baseRegistryForm.create({
      data: {
        formType: data.formType,
        formNumber: data.formNumber,
        registryNumber: data.registryNumber,
        province: data.province,
        cityMunicipality: data.cityMunicipality,
        pageNumber: data.pageNumber,
        bookNumber: data.bookNumber,
        dateOfRegistration: data.dateOfRegistration,
        status: 'PENDING',
      },
      include: {
        preparedBy: {
          select: { name: true },
        },
        verifiedBy: {
          select: { name: true },
        },
      },
    });

    revalidatePath('/civil-registry');
    return {
      success: true,
      message: 'Form created successfully',
      data: baseForm as BaseRegistryFormWithRelations,
    };
  } catch (error) {
    console.error('Error creating civil registry form:', error);
    return { success: false, message: 'Failed to create form' };
  }
}

// src/app/_actions/civil-registry.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { CivilRegistryForm } from '@prisma/client'

export type CivilRegistryFormWithRelations = CivilRegistryForm & {
  preparedBy: { name: string } | null
  verifiedBy: { name: string } | null
}

export async function deleteCivilRegistryForm(formId: string) {
  try {
    await prisma.civilRegistryForm.delete({
      where: { id: formId },
    })

    revalidatePath('/civil-registry')
    return { success: true, message: 'Form deleted successfully' }
  } catch (error) {
    console.error('Error deleting civil registry form:', error)
    return { success: false, message: 'Failed to delete form' }
  }
}

export async function updateCivilRegistryForm(
  formId: string,
  data: Partial<CivilRegistryForm>
): Promise<{
  success: boolean
  message: string
  data?: CivilRegistryFormWithRelations
}> {
  try {
    const updatedForm = await prisma.civilRegistryForm.update({
      where: { id: formId },
      data,
      include: {
        preparedBy: {
          select: { name: true }
        },
        verifiedBy: {
          select: { name: true }
        }
      }
    })

    revalidatePath('/civil-registry')
    return {
      success: true,
      message: 'Form updated successfully',
      data: updatedForm as CivilRegistryFormWithRelations
    }
  } catch (error) {
    console.error('Error updating civil registry form:', error)
    return { success: false, message: 'Failed to update form' }
  }
}
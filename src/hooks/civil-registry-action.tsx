// src\hooks\civil-registry-action.tsx
"use server"

import { prisma } from "@/lib/prisma"
import {
  Attachment,
  BaseRegistryForm,
  BirthCertificateForm,
  CertifiedCopy,
  DeathCertificateForm,
  Document,
  FormType,
  MarriageCertificateForm,
} from "@prisma/client"
import { revalidatePath } from "next/cache"


export type BaseRegistryFormWithRelations = BaseRegistryForm & {
  preparedBy: { name: string } | null
  verifiedBy: { name: string } | null
  marriageCertificateForm?: MarriageCertificateForm | null
  birthCertificateForm?: BirthCertificateForm | null
  deathCertificateForm?: DeathCertificateForm | null
  documents: {
    document: Document & {
      attachments: (Attachment & {
        certifiedCopies: CertifiedCopy[]
      })[]
    }
  }[]
}

export async function getBaseRegistryForms(): Promise<BaseRegistryFormWithRelations[]> {
  return await prisma.baseRegistryForm.findMany({
    include: {
      preparedBy: {
        select: { name: true },
      },
      verifiedBy: {
        select: { name: true },
      },
      marriageCertificateForm: true,
      birthCertificateForm: true,
      deathCertificateForm: true,
      documents: {
        include: {
          document: {
            include: {
              attachments: {
                include: { certifiedCopies: true }
              }
            }
          }
        }
      },
    },
  })
}

export async function getBaseRegistryForm(
  formId: string
): Promise<BaseRegistryFormWithRelations | null> {
  return await prisma.baseRegistryForm.findUnique({
    where: { id: formId },
    include: {
      preparedBy: {
        select: { name: true },
      },
      verifiedBy: {
        select: { name: true },
      },
      marriageCertificateForm: true,
      birthCertificateForm: true,
      deathCertificateForm: true,
      documents: {
        include: {
          document: {
            include: {
              attachments: {
                include: { certifiedCopies: true }
              }
            }
          }
        }
      },
    },
  })
}

export async function deleteBaseRegistryForm(formId: string) {
  try {
    await prisma.baseRegistryForm.delete({
      where: { id: formId },
    })

    revalidatePath("/civil-registry")
    return { success: true, message: "Form deleted successfully" }
  } catch (error) {
    console.error("Error deleting civil registry form:", error)
    return { success: false, message: "Failed to delete form" }
  }
}

export async function updateBaseRegistryForm(
  formId: string,
  data: Partial<BaseRegistryForm>
): Promise<{
  success: boolean
  message: string
  data?: BaseRegistryFormWithRelations
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
        marriageCertificateForm: true,
        birthCertificateForm: true,
        deathCertificateForm: true,
      },
    })

    revalidatePath("/civil-registry")
    return {
      success: true,
      message: "Form updated successfully",
      data: updatedForm as BaseRegistryFormWithRelations,
    }
  } catch (error) {
    console.error("Error updating civil registry form:", error)
    return { success: false, message: "Failed to update form" }
  }
}

export async function createBaseRegistryForm(data: {
  formType: FormType
  formNumber: string
  registryNumber: string
  province: string
  cityMunicipality: string
  pageNumber: string
  bookNumber: string
  dateOfRegistration: Date
  preparedById?: string
  verifiedById?: string
  remarks?: string
  lcroNotations?: string
}): Promise<{
  success: boolean
  message: string
  data?: BaseRegistryFormWithRelations
}> {
  try {
    const createdForm = await prisma.baseRegistryForm.create({
      data: {
        ...data,
        status: "PENDING",
      },
      include: {
        preparedBy: {
          select: { name: true },
        },
        verifiedBy: {
          select: { name: true },
        },
        marriageCertificateForm: true,
        birthCertificateForm: true,
        deathCertificateForm: true,
      },
    })

    revalidatePath("/civil-registry")
    return {
      success: true,
      message: "Form created successfully",
      data: createdForm as BaseRegistryFormWithRelations,
    }
  } catch (error) {
    console.error("Error creating civil registry form:", error)
    return { success: false, message: "Failed to create form" }
  }
}
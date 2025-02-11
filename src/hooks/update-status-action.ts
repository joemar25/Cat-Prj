// src\hooks\update-status-action.ts
'use server'

import { prisma } from '@/lib/prisma'
import { DocumentStatus } from '@prisma/client'

export async function updateFormStatus(formId: string, status: DocumentStatus) {
    return await prisma.baseRegistryForm.update({
        where: { id: formId },
        data: { status },
    })
}

// src/types/certified-true-copy.ts
import { CertifiedCopy, CivilRegistryFormBase } from '@prisma/client'

export interface ExtendedCertifiedCopy extends CertifiedCopy {
    attachment?: {
        fileName?: string
    } | null
    form?: CivilRegistryFormBase | null
}
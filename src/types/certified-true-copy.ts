import { CertifiedCopy as PrismaCertifiedCopy } from '@prisma/client'

export interface ExtendedCertifiedCopy extends PrismaCertifiedCopy {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    attachment: {
        fileName: string
    }
}

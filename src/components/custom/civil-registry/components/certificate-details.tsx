'use client'


import dynamic from 'next/dynamic'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'

// Dynamically import certificate-specific details cards with SSR disabled.
const DynamicBirthDetailsCard = dynamic(
    () => import('./birth-details-card').then((mod) => mod.BirthDetailsCard),
    { ssr: false }
)
const DynamicDeathDetailsCard = dynamic(
    () => import('./death-details-card').then((mod) => mod.DeathDetailsCard),
    { ssr: false }
)
const DynamicMarriageDetailsCard = dynamic(
    () => import('./marriage-details-card').then((mod) => mod.MarriageDetailsCard),
    { ssr: false }
)

interface CertificateDetailsProps {
    form: BaseRegistryFormWithRelations
}

export const CertificateDetails: React.FC<CertificateDetailsProps> = ({ form }) => {

    if (form.marriageCertificateForm) {
        return <DynamicMarriageDetailsCard form={form} />
    }
    if (form.birthCertificateForm) {
        return <DynamicBirthDetailsCard form={form} />
    }
    if (form.deathCertificateForm) {
        return <DynamicDeathDetailsCard form={form} />
    }
    return null
}

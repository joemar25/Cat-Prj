'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BaseDetailsCard } from './base-details-card'
import { BirthDetailsCard } from './birth-details-card'
import { DeathDetailsCard } from './death-details-card'
import { MarriageDetailsCard } from './marriage-details-card'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { FormType } from '@prisma/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

interface ViewDetailsDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    form: BaseRegistryFormWithRelations
}

const formTypeLabels: Record<FormType, string> = {
    MARRIAGE: 'Marriage (Form 97)',
    BIRTH: 'Birth (Form 102)',
    DEATH: 'Death (Form 103)',
}

export const ViewDetailsDialog: React.FC<ViewDetailsDialogProps> = ({
    open,
    onOpenChangeAction,
    form
}) => {
    const { t } = useTranslation()

    const renderSpecificDetails = () => {
        if (form.marriageCertificateForm) return <MarriageDetailsCard form={form} />
        if (form.birthCertificateForm) return <BirthDetailsCard form={form} />
        if (form.deathCertificateForm) return <DeathDetailsCard form={form} />
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center pt-4">
                        {t('Certificate Details')}
                    </DialogTitle>
                    <div className="text-center text-lg font-medium">
                        {formTypeLabels[form.formType]}
                    </div>
                    <DialogDescription className="font-bold text-center">
                        {t('Review the details of the certificate below')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-auto">
                    <BaseDetailsCard form={form} />dasdsa
                    {renderSpecificDetails()}
                </div>
            </DialogContent>
        </Dialog>
    )
}

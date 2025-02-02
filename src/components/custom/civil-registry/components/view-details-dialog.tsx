'use client'

import { FormType } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { JsonValue } from '@prisma/client/runtime/library'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export interface ViewDetailsDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    form: BaseRegistryFormWithRelations
}

const formTypeLabels: Record<FormType, string> = {
    MARRIAGE: 'Marriage (Form 97)',
    BIRTH: 'Birth (Form 102)',
    DEATH: 'Death (Form 103)',
}

const statusVariants: Record<
    string,
    {
        label: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
> = {
    PENDING: { label: 'Pending', variant: 'secondary' },
    VERIFIED: { label: 'Verified', variant: 'default' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
    EXPIRED: { label: 'Expired', variant: 'outline' },
}

interface FullNameFormat {
    firstName?: string
    middleName?: string
    lastName?: string
}

interface ShortNameFormat {
    first?: string
    middle?: string
    last?: string
}

type NameObject = FullNameFormat | ShortNameFormat

export function ViewDetailsDialog({
    open,
    onOpenChangeAction,
    form,
}: ViewDetailsDialogProps) {
    const { t } = useTranslation()

    const isNameObject = (value: unknown): value is NameObject => {
        if (!value || typeof value !== 'object') return false
        const obj = value as Record<string, unknown>
        return (
            (('firstName' in obj || 'first' in obj) &&
                ('lastName' in obj || 'last' in obj)) ||
            'middleName' in obj ||
            'middle' in obj
        )
    }

    const formatName = (nameObj: JsonValue | null): string => {
        if (!nameObj) return ''

        if (typeof nameObj === 'string') {
            try {
                const parsed = JSON.parse(nameObj)
                if (!isNameObject(parsed)) return nameObj

                const firstName =
                    (parsed as FullNameFormat).firstName ||
                    (parsed as ShortNameFormat).first ||
                    ''
                const middleName =
                    (parsed as FullNameFormat).middleName ||
                    (parsed as ShortNameFormat).middle ||
                    ''
                const lastName =
                    (parsed as FullNameFormat).lastName ||
                    (parsed as ShortNameFormat).last ||
                    ''

                return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim()
            } catch {
                return nameObj
            }
        }

        if (isNameObject(nameObj)) {
            const firstName =
                (nameObj as FullNameFormat).firstName ||
                (nameObj as ShortNameFormat).first ||
                ''
            const middleName =
                (nameObj as FullNameFormat).middleName ||
                (nameObj as ShortNameFormat).middle ||
                ''
            const lastName =
                (nameObj as FullNameFormat).lastName ||
                (nameObj as ShortNameFormat).last ||
                ''

            return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim()
        }

        return String(nameObj)
    }

    const getSpecificFormDetails = () => {
        if (form.marriageCertificateForm) {
            return (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('husband')}</span>
                        <span className="col-span-3">
                            {`${form.marriageCertificateForm.husbandFirstName} ${form.marriageCertificateForm.husbandLastName}`}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('wife')}</span>
                        <span className="col-span-3">
                            {`${form.marriageCertificateForm.wifeFirstName} ${form.marriageCertificateForm.wifeLastName}`}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('dateOfMarriage')}</span>
                        <span className="col-span-3">
                            {new Date(form.marriageCertificateForm.dateOfMarriage).toLocaleDateString()}
                        </span>
                    </div>
                </>
            )
        } else if (form.birthCertificateForm) {
            return (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('childName')}</span>
                        <span className="col-span-3">{formatName(form.birthCertificateForm.childName)}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('dateOfBirth')}</span>
                        <span className="col-span-3">
                            {new Date(form.birthCertificateForm.dateOfBirth).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('sex')}</span>
                        <span className="col-span-3">{form.birthCertificateForm.sex}</span>
                    </div>
                </>
            )
        } else if (form.deathCertificateForm) {
            return (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('deceasedName')}</span>
                        <span className="col-span-3">{formatName(form.deathCertificateForm.deceasedName)}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('dateOfDeath')}</span>
                        <span className="col-span-3">
                            {new Date(form.deathCertificateForm.dateOfDeath).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('sex')}</span>
                        <span className="col-span-3">{form.deathCertificateForm.sex}</span>
                    </div>
                </>
            )
        }
        return null
    }

    // If the form has an associated document with attachments, fetch the latest one
    const latestAttachment =
        form.document && form.document.attachments && form.document.attachments.length > 0
            ? [...form.document.attachments].sort(
                (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )[0]
            : null

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('formDetails.title')}</DialogTitle>
                    <DialogDescription>{t('formDetails.description')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('formDetails.formType')}</span>
                        <span className="col-span-3">{formTypeLabels[form.formType]}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('formDetails.registryNo')}</span>
                        <span className="col-span-3">{form.registryNumber}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">{t('formDetails.status')}</span>
                        <span className="col-span-3">
                            <Badge variant={statusVariants[form.status]?.variant || 'default'}>
                                {statusVariants[form.status]?.label || form.status}
                            </Badge>
                        </span>
                    </div>
                    {getSpecificFormDetails()}
                </div>
                {latestAttachment && (
                    <div className="border-t pt-4">
                        <h4 className="font-medium text-lg">{t('latestAttachment')}</h4>
                        <div className="mt-2">
                            <a
                                href={latestAttachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {latestAttachment.fileName}
                            </a>
                            <p className="text-xs text-muted-foreground">
                                {t('uploadedOn')} {new Date(latestAttachment.uploadedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

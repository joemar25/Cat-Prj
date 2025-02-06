// src/components/custom/civil-registry/components/attachment-table.tsx
'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Attachment,
    BirthCertificateForm,
    CertifiedCopy,
    DeathCertificateForm,
    FormType,
    MarriageCertificateForm,
} from '@prisma/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/ui/icons'
import Link from 'next/link'

// Import the annotation forms (they must accept a "formData" prop)
import BirthAnnotationForm from '@/components/custom/forms/annotations/birth-cert-annotation'
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'

// Extend Attachment to include certifiedCopies (which determines if a certified true copy has been issued)
export interface AttachmentWithCertifiedCopies extends Attachment {
    certifiedCopies?: CertifiedCopy[]
}

interface AttachmentsTableProps {
    attachments: AttachmentWithCertifiedCopies[]
    /**
     * Callback to trigger when an attachment has been deleted.
     */
    onAttachmentDeleted?: (deletedId: string) => void
    /**
     * Controls whether the delete action is available.
     */
    canDelete?: boolean
    /**
     * The form type for which the annotation dialog should be rendered.
     */
    formType: FormType
    /**
     * The form data for pre-filling annotation forms.
     */
    formData?: BaseRegistryFormWithRelations & {
        birthCertificateForm?: BirthCertificateForm | null
        deathCertificateForm?: DeathCertificateForm | null
        marriageCertificateForm?: MarriageCertificateForm | null
    }
}

export const AttachmentsTable: React.FC<AttachmentsTableProps> = ({
    attachments,
    onAttachmentDeleted,
    canDelete = true,
    formType,
    formData,
}) => {
    const { t } = useTranslation()

    // State to control the annotation form dialog (for issuing certificate)
    const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

    // Helper: Get the form id for the annotation form based on form type.
    const getFormId = (): string | null => {
        switch (formType) {
            case 'BIRTH':
                return formData?.birthCertificateForm?.id ?? null
            case 'DEATH':
                return formData?.deathCertificateForm?.id ?? null
            case 'MARRIAGE':
                return formData?.marriageCertificateForm?.id ?? null
            default:
                return null
        }
    }

    // Handler to open the annotation dialog.
    // (No redundant API call here; the annotation form itself can handle linking if needed.)
    const handleIssueCertificate = (attachment: AttachmentWithCertifiedCopies) => {
        setAnnotationFormOpen(true)
    }

    // Handler for deleting an attachment.
    const handleDelete = async (attachmentId: string) => {
        try {
            const res = await fetch(`/api/attachments/${attachmentId}`, {
                method: 'DELETE',
            })
            const json = await res.json()
            if (!res.ok) {
                throw new Error(json.error || t('Failed to delete attachment'))
            }
            toast.success(t('Attachment deleted successfully'))
            onAttachmentDeleted?.(attachmentId)
        } catch (error: unknown) {
            console.error('Delete error:', error)
            const errMsg =
                error instanceof Error ? error.message : t('Failed to delete attachment')
            toast.error(errMsg)
        }
    }

    // Handler for exporting an attachment.
    const handleExport = async (attachment: AttachmentWithCertifiedCopies) => {
        try {
            // Use optional chaining to check if certified copies exist.
            const hasCTC = (attachment.certifiedCopies?.length ?? 0) > 0

            // Build the export URL: if certified, add a parameter for zip export.
            const exportUrl = hasCTC
                ? `/api/attachments/export?attachmentId=${attachment.id}&zip=true`
                : `/api/attachments/export?attachmentId=${attachment.id}`

            const res = await fetch(exportUrl)
            if (!res.ok) {
                throw new Error(t('Failed to export attachment'))
            }
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = hasCTC
                ? attachment.fileName.replace(/\.[^/.]+$/, '') + '.zip'
                : attachment.fileName
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error: unknown) {
            console.error('Export error:', error)
            const errMsg =
                error instanceof Error ? error.message : t('Failed to export attachment')
            toast.error(errMsg)
        }
    }

    return (
        <>
            {attachments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    {t('No attachments available.')}
                </p>
            ) : (
                <>
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-2 text-left">{t('File Name')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('Uploaded On')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('CTC Issued')}</TableHead>
                                <TableHead className="px-4 py-2 text-left">{t('Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.map((attachment) => {
                                const hasCTC = (attachment.certifiedCopies?.length ?? 0) > 0
                                // In production you might disable export if no CTC is issued.
                                const disableExport =
                                    process.env.NODE_ENV === 'production' && !hasCTC

                                return (
                                    <TableRow key={attachment.id} className="border-b">
                                        <TableCell className="px-4 py-2">
                                            <span className="block truncate max-w-xs" title={attachment.fileName}>
                                                {attachment.fileName}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            {new Date(attachment.uploadedAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            {hasCTC ? (
                                                <span className="text-green-600 font-semibold">{t('Yes')}</span>
                                            ) : (
                                                <span className="text-gray-500">{t('No')}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                {canDelete && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                {t('Delete')}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t('This action cannot be undone. This will permanently delete the attachment.')}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(attachment.id)}>
                                                                    {t('Delete')}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleExport(attachment)}
                                                    disabled={disableExport}
                                                >
                                                    {hasCTC ? t('Export (ZIP)') : t('Export')}
                                                </Button>

                                                {/* Issue Certificate Button opens the annotation dialog */}
                                                <Button onClick={() => handleIssueCertificate(attachment)} variant="secondary" size="sm">
                                                    <Icons.files className="mr-2 h-4 w-4" />
                                                    {t('issueCertificate')}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    {/* Annotation Form Dialogs based on form type */}
                    {formType === 'BIRTH' && (
                        <BirthAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                    {formType === 'DEATH' && (
                        <DeathAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                    {formType === 'MARRIAGE' && (
                        <MarriageAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                            formData={formData!}
                        />
                    )}
                </>
            )}
        </>
    )
}

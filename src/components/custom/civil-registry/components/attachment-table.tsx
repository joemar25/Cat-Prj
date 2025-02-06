// src/components/custom/civil-registry/components/attachment-table.tsx
'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Attachment, CertifiedCopy, FormType } from '@prisma/client'
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

// Import the annotation forms
import BirthAnnotationForm from '@/components/custom/forms/annotations/birthcert'
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation-form'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'

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
}

export const AttachmentsTable: React.FC<AttachmentsTableProps> = ({
    attachments,
    onAttachmentDeleted,
    canDelete = true,
    formType,
}) => {
    const { t } = useTranslation()

    // State to control opening the annotation form dialog
    const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

    // Delete action for a single attachment.
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

    // Export action for a single attachment.
    const handleExport = async (attachment: AttachmentWithCertifiedCopies) => {
        try {
            const hasCTC =
                Array.isArray(attachment.certifiedCopies) && attachment.certifiedCopies.length > 0

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
                                <TableHead className="px-4 py-2 text-left">{t('Actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attachments.map((attachment) => {
                                const hasCTC =
                                    Array.isArray(attachment.certifiedCopies) && attachment.certifiedCopies.length > 0
                                // In production, disable export if no certified true copy exists.
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
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setAnnotationFormOpen(true)}
                                                >
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
                        />
                    )}
                    {formType === 'DEATH' && (
                        <DeathAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                        />
                    )}
                    {formType === 'MARRIAGE' && (
                        <MarriageAnnotationForm
                            open={annotationFormOpen}
                            onOpenChange={setAnnotationFormOpen}
                            onCancel={() => setAnnotationFormOpen(false)}
                        />
                    )}
                </>
            )}
        </>
    )
}

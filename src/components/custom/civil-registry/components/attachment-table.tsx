'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Attachment, CertifiedCopy } from '@prisma/client'
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

export interface AttachmentWithCertifiedCopies extends Attachment {
    certifiedCopies?: CertifiedCopy[]
}

interface AttachmentsTableProps {
    attachments: AttachmentWithCertifiedCopies[]
    /**
     * Callback to trigger when an attachment has been deleted.
     * It receives the deleted attachment's id.
     */
    onAttachmentDeleted?: (deletedId: string) => void
    /**
     * Callback to trigger when adding a certified true copy attachment.
     * It receives the id of the main attachment.
     */
    onAddCertifiedCopy?: (attachmentId: string) => void
    /**
     * Controls whether the delete action is available.
     */
    canDelete?: boolean
}

export const AttachmentsTable: React.FC<AttachmentsTableProps> = ({
    attachments,
    onAttachmentDeleted,
    onAddCertifiedCopy,
    canDelete = true,
}) => {
    const { t } = useTranslation()

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
            const errMsg = error instanceof Error ? error.message : t('Failed to delete attachment')
            toast.error(errMsg)
        }
    }

    // Export action for a single attachment.
    const handleExport = async (attachment: AttachmentWithCertifiedCopies) => {
        try {
            const hasCertifiedCopies =
                Array.isArray(attachment.certifiedCopies) && attachment.certifiedCopies.length > 0

            const exportUrl = hasCertifiedCopies
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
            a.download = hasCertifiedCopies
                ? attachment.fileName.replace(/\.[^/.]+$/, '') + '.zip'
                : attachment.fileName
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error: unknown) {
            console.error('Export error:', error)
            const errMsg = error instanceof Error ? error.message : t('Failed to export attachment')
            toast.error(errMsg)
        }
    }

    return (
        <>
            {attachments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">{t('No attachments available.')}</p>
            ) : (
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-4 py-2 text-left">{t('File Name')}</TableHead>
                            <TableHead className="px-4 py-2 text-left">{t('Uploaded On')}</TableHead>
                            <TableHead className="px-4 py-2 text-left">{t('Actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attachments.map((attachment) => (
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
                                        {/* Conditionally render Delete Action if allowed */}
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
                                        {/* Export Action */}
                                        <Button variant="outline" size="sm" onClick={() => handleExport(attachment)}>
                                            {Array.isArray(attachment.certifiedCopies) && attachment.certifiedCopies.length > 0
                                                ? t('Export (ZIP)')
                                                : t('Export')}
                                        </Button>
                                        {/* Add Certified Copy Action */}
                                        <Button variant="secondary" size="sm" onClick={() => onAddCertifiedCopy?.(attachment.id)}>
                                            {t('Add Certified Copy')}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    )
}

// src/components/custom/civil-registry/components/base-details-card.tsx
'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { FormType, Permission, Attachment } from '@prisma/client'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

import { useUser } from '@/context/user-context'
import { hasPermission } from '@/types/auth'

import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'
import { AttachmentsTable, AttachmentWithCertifiedCopies } from '../../civil-registry/components/attachment-table'

interface BaseDetailsCardProps {
    form: BaseRegistryFormWithRelations
    onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

const formTypeLabels: Record<FormType, string> = {
    MARRIAGE: 'Marriage (Form 97)',
    BIRTH: 'Birth (Form 102)',
    DEATH: 'Death (Form 103)',
}

const statusVariants: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    PENDING: { label: 'Pending', variant: 'secondary' },
    VERIFIED: { label: 'Verified', variant: 'default' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
    EXPIRED: { label: 'Expired', variant: 'outline' },
}

/**
 * Helper function to create an Attachment object.
 */
const createAttachment = (fileUrl: string): Attachment => {
    const fileName = fileUrl.split('/').pop() || fileUrl
    return { fileUrl, fileName, fileSize: 0 } as Attachment
}

export const BaseDetailsCard: React.FC<BaseDetailsCardProps> = ({ form, onUpdateAction }) => {
    const { t } = useTranslation()
    const { permissions } = useUser()

    // Action permissions
    const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
    const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
    const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)

    // Dialog state variables for editing and uploading
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

    // Get the latest attachment if available
    const attachments = form.document?.attachments || []
    const latestAttachment = attachments.length
        ? [...attachments].sort(
            (a, b) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )[0]
        : null

    /**
     * Callback for when the attachment has been deleted.
     */
    const handleAttachmentDeleted = () => {
        if (form.document) {
            const updatedAttachments = form.document.attachments.filter(
                (att) => att.id !== latestAttachment?.id
            )
            onUpdateAction?.({
                ...form,
                document: {
                    ...form.document,
                    attachments: updatedAttachments,
                },
            })
        }
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">{t('Base Details')}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Form Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium">{t('Form Number')}</p>
                        <div>{form.formNumber}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Registry Number')}</p>
                        <div>{form.registryNumber}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Form Type')}</p>
                        <div>{formTypeLabels[form.formType]}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Status')}</p>
                        <div>
                            <Badge variant={statusVariants[form.status]?.variant || 'default'}>
                                {statusVariants[form.status]?.label || form.status}
                            </Badge>
                        </div>
                    </div>
                    {/* … other details … */}
                </div>

                {/* Actions Section */}
                {(canUpload || canEdit || canDelete) && (
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-lg">{t('Actions')}</h4>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {canUpload && (
                                <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
                                    <Icons.add className="mr-2 h-4 w-4" />
                                    {t('scanDocumentUpload')}
                                </Button>
                            )}
                            {canEdit && (
                                <Button onClick={() => setEditDialogOpen(true)} variant="secondary">
                                    <Icons.edit className="mr-2 h-4 w-4" />
                                    {t('editForm.title')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Latest Attachment Section as Table */}
                <div className="mt-4">
                    <h4 className="font-medium text-lg">{t('Latest Attachment')}</h4>
                    <AttachmentsTable
                        attachments={latestAttachment ? [latestAttachment as AttachmentWithCertifiedCopies] : []}
                        onAttachmentDeleted={handleAttachmentDeleted}
                        formType={form.formType}
                        formData={form}
                    />
                </div>
            </CardContent>

            {/* Dialogs */}
            {canUpload && (
                <FileUploadDialog
                    open={uploadDialogOpen}
                    onOpenChangeAction={setUploadDialogOpen}
                    onUploadSuccess={(fileUrl: string) => {
                        const newAttachment = createAttachment(fileUrl)
                        if (form.document) {
                            onUpdateAction?.({
                                ...form,
                                document: {
                                    ...form.document,
                                    attachments: [...(form.document.attachments || []), newAttachment],
                                },
                            })
                        }
                    }}
                    formId={form.id}
                    formType={form.formType}
                    registryNumber={form.registryNumber}
                />
            )}

            {canEdit && (
                <EditCivilRegistryFormDialog
                    form={form}
                    open={editDialogOpen}
                    onOpenChangeAction={setEditDialogOpen}
                    onSave={(updatedForm) => {
                        toast.success(`Form ${updatedForm.id} has been updated successfully!`)
                        onUpdateAction?.(updatedForm)
                        setEditDialogOpen(false)
                    }}
                />
            )}
        </Card>
    )
}

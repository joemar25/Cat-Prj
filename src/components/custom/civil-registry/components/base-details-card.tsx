'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormType, Permission, Attachment, DocumentStatus } from '@prisma/client'
import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'
import { AttachmentsTable, AttachmentWithCertifiedCopies } from '@/components/custom/civil-registry/components/attachment-table'

import StatusSelect from './status-dropdown'

interface BaseDetailsCardProps {
    form: BaseRegistryFormWithRelations
    onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

const formTypeLabels: Record<FormType, string> = {
    MARRIAGE: 'Marriage (Form 97)',
    BIRTH: 'Birth (Form 102)',
    DEATH: 'Death (Form 103)',
}

/**
 * Helper function to create a minimal Attachment object from file data.
 * (This is used only for UI purposes when uploading an attachment.)
 */
const createAttachment = (fileUrl: string): Attachment & { certifiedCopies: never[] } => {
    const fileName = fileUrl.split('/').pop() || fileUrl
    return {
        id: '',
        userId: null,
        documentId: null,
        type: 'BIRTH_CERTIFICATE' as const,
        fileUrl,
        fileName,
        fileSize: 0,
        mimeType: 'application/octet-stream',
        status: 'PENDING' as const,
        uploadedAt: new Date(),
        updatedAt: new Date(),
        verifiedAt: null,
        notes: null,
        metadata: null,
        hash: null,
        certifiedCopies: [],
    }
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

    // Explicitly cast attachments to include certifiedCopies.
    const attachments: AttachmentWithCertifiedCopies[] = form.documents
        .flatMap(doc => doc.document.attachments)
        .map(att => ({
            ...att,
            certifiedCopies: att.certifiedCopies ?? []
        }));

    // Ensure every attachment has a certifiedCopies array (default to empty if missing).
    const attachmentsWithCTC = attachments.map((att) => ({
        ...att,
        certifiedCopies: att.certifiedCopies ?? [],
    }))

    // Get the latest attachment by sorting by uploadedAt descending.
    const latestAttachment = attachmentsWithCTC.length
        ? [...attachmentsWithCTC].sort(
            (a, b) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )[0]
        : null

    /**
     * Callback for when an attachment has been deleted.
     */
    const handleAttachmentDeleted = (deletedId: string) => {
        const updatedDocuments = form.documents.map(doc => ({
            ...doc,
            document: {
                ...doc.document,
                attachments: doc.document.attachments.filter(att => att.id !== deletedId)
            }
        }));

        onUpdateAction?.({
            ...form,
            documents: updatedDocuments
        });
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
                            <StatusSelect
                                formId={form.id}
                                currentStatus={form.status as DocumentStatus}
                                onStatusChange={(newStatus) =>
                                    onUpdateAction?.({ ...form, status: newStatus })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                {(canUpload || canEdit || canDelete) && (
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-lg">{t('Actions')}</h4>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {canUpload && (
                                <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
                                    <Icons.add className="mr-2 h-4 w-4" />
                                    {t('uploadDocument')}
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
                        attachments={attachments}
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
                    onUploadSuccess={(fileData) => {
                        const newAttachment = createAttachment(fileData.url)
                        onUpdateAction?.({
                            ...form,
                            documents: [
                                ...form.documents,
                                {
                                    document: {
                                        id: fileData.id,
                                        status: 'PENDING' as const,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                        type: form.formType === 'BIRTH' ? 'BIRTH_CERTIFICATE' :
                                            form.formType === 'DEATH' ? 'DEATH_CERTIFICATE' : 'MARRIAGE_CERTIFICATE',
                                        title: `${form.formType} Document - ${form.registryNumber}`,
                                        description: null,
                                        metadata: {},
                                        version: 1,
                                        isLatest: true,
                                        attachments: [{
                                            ...newAttachment,
                                            id: fileData.id,
                                            certifiedCopies: [],
                                        }],
                                    },
                                },
                            ],
                        })
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
                        toast.success(`${t('Form updated successfully')} ${updatedForm.id}!`)
                        onUpdateAction?.(updatedForm)
                        setEditDialogOpen(false)
                    }}
                />
            )}
        </Card>
    )
}

export default BaseDetailsCard
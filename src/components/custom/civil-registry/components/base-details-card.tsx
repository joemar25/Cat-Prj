// src/components/custom/civil-registry/components/base-details-card.tsx
'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { FormType, Permission, Attachment } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { formatDate, renderName } from './utils'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useUser } from '@/context/user-context'
import { hasPermission } from '@/types/auth'
import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'
import { useDeleteFormAction } from '@/components/custom/civil-registry/actions/delete-form-action'
import { DeleteConfirmationDialog } from '@/components/custom/civil-registry/components/delete-confirmation-dialog'

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

interface BaseDetailsCardProps {
    form: BaseRegistryFormWithRelations
    onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

export const BaseDetailsCard: React.FC<BaseDetailsCardProps> = ({ form, onUpdateAction }) => {
    const { t } = useTranslation()
    const { permissions } = useUser()

    // Action permissions
    const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
    const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
    const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)

    // State variables for dialogs
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)

    // Delete action hook (assumes onUpdateAction is provided)
    const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })

    // Get the latest attachment (if any) from the form's document attachments.
    const latestAttachment =
        form.document &&
            form.document.attachments &&
            form.document.attachments.length > 0
            ? [...form.document.attachments].sort(
                (a, b) =>
                    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )[0]
            : null

    // Handler for deletion confirmation.
    const onConfirmDelete = () => {
        handleDelete()
        setDeletionAlertOpen(false)
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">{t('Base Details')}</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <div>
                        <p className="font-medium">{t('Province')}</p>
                        <div>{form.province}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('City/Municipality')}</p>
                        <div>{form.cityMunicipality}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Page Number')}</p>
                        <div>{form.pageNumber}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Book Number')}</p>
                        <div>{form.bookNumber}</div>
                    </div>
                    <div>
                        <p className="font-medium">{t('Date of Registration')}</p>
                        <div>{formatDate(form.dateOfRegistration)}</div>
                    </div>
                    {form.preparedBy && (
                        <div>
                            <p className="font-medium">{t('Prepared By')}</p>
                            <div>{renderName(form.preparedBy.name)}</div>
                        </div>
                    )}
                    {form.verifiedBy && (
                        <div>
                            <p className="font-medium">{t('Verified By')}</p>
                            <div>{renderName(form.verifiedBy.name)}</div>
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                {(canUpload || canEdit || canDelete) && (
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-lg">{t('Actions')}</h4>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {canUpload && (
                                <>
                                    <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
                                        <Icons.add className="mr-2 h-4 w-4" />
                                        {t('importDocument')}
                                    </Button>
                                    <Button onClick={() => setUploadDialogOpen(true)} variant="outline">
                                        <Icons.add className="mr-2 h-4 w-4" />
                                        {t('scanDocument')}
                                    </Button>
                                </>
                            )}
                            {canEdit && (
                                <Button onClick={() => setEditDialogOpen(true)} variant="secondary">
                                    <Icons.file className="mr-2 h-4 w-4" />
                                    {t('issueCertificate')}
                                </Button>
                            )}
                            {canDelete && (
                                <Button
                                    onClick={() => setDeletionAlertOpen(true)}
                                    variant="destructive"
                                    disabled={isLoading}
                                >
                                    <Icons.trash className="mr-2 h-4 w-4" />
                                    {isLoading ? t('deleting') : t('delete')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Latest Attachment Section */}
                <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-lg">{t('latestAttachment')}</h4>
                    {latestAttachment ? (
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
                                {t('uploadedOn')}{' '}
                                {new Date(latestAttachment.uploadedAt).toLocaleString()}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <p className="text-xs text-muted-foreground">{t('noDocumentFound')}</p>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Deletion Confirmation Dialog */}
            {canDelete && (
                <DeleteConfirmationDialog
                    open={deletionAlertOpen}
                    onOpenChangeAction={setDeletionAlertOpen}
                    onConfirmAction={onConfirmDelete}
                    isLoading={isLoading}
                />
            )}

            {/* Dialogs */}
            {canUpload && (
                <FileUploadDialog
                    open={uploadDialogOpen}
                    onOpenChangeAction={setUploadDialogOpen}
                    onUploadSuccess={(fileUrl: string) => {
                        // Create a minimal attachment object for UI purposes.
                        const newAttachment = {
                            fileUrl,
                            fileName: fileUrl.split('/').pop() || fileUrl,
                            fileSize: 0,
                        } as unknown as Attachment

                        if (form.document) {
                            onUpdateAction?.({
                                ...form,
                                document: {
                                    ...form.document,
                                    attachments: form.document.attachments
                                        ? [...form.document.attachments, newAttachment]
                                        : [newAttachment],
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

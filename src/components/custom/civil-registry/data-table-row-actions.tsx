'use client'

import Link from 'next/link'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Permission, Attachment, CertifiedCopy, AttachmentType, DocumentStatus } from '@prisma/client'

import { hasPermission } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { useDeleteFormAction } from '@/components/custom/civil-registry/actions/delete-form-action'

import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { DeleteConfirmationDialog } from '@/components/custom/civil-registry/components/delete-confirmation-dialog'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'

// Import annotation forms
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation'
import BirthAnnotationForm from '@/components/custom/forms/annotations/birth-cert-annotation'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'

import { Icons } from '@/components/ui/icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Extended types
interface FormWithCTC extends BaseRegistryFormWithRelations {
  certifiedCopies?: CertifiedCopy[]
}

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>
  onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

/**
 * Helper function to create a minimal attachment object
 */
const createAttachment = (fileData: { url: string; id: string }): Attachment => {
  return {
    id: fileData.id,
    userId: null,
    documentId: null,
    type: 'BIRTH_CERTIFICATE' as AttachmentType, // Will be updated with correct type
    fileUrl: fileData.url,
    fileName: fileData.url.split('/').pop() || fileData.url,
    fileSize: 0,
    mimeType: 'application/octet-stream',
    status: 'PENDING' as DocumentStatus,
    uploadedAt: new Date(),
    updatedAt: new Date(),
    verifiedAt: null,
    notes: null,
    metadata: null,
    hash: null,
  } as Attachment
}

export function DataTableRowActions({ row, onUpdateAction }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const form = row.original

  // Cast the form to include certified copies
  const formWithCTC = form as FormWithCTC
  const hasCertifiedCopy = formWithCTC.certifiedCopies && formWithCTC.certifiedCopies.length > 0
  const hasAttachments = form.document?.attachments && form.document.attachments.length > 0

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)
  const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

  // Delete action hook
  const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })

  // Permission checks
  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  // Handle file upload success
  const handleUploadSuccess = (fileData: { url: string; id: string }) => {
    const newAttachment = createAttachment(fileData)

    if (form.document) {
      onUpdateAction?.({
        ...form,
        document: {
          ...form.document,
          attachments: [
            ...(form.document.attachments || []),
            {
              ...newAttachment,
              type: form.formType === 'BIRTH'
                ? AttachmentType.BIRTH_CERTIFICATE
                : form.formType === 'DEATH'
                  ? AttachmentType.DEATH_CERTIFICATE
                  : AttachmentType.MARRIAGE_CERTIFICATE
            }
          ],
        },
      })
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* CTC Badge */}
        {hasCertifiedCopy && (
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
            {t('ctcIssued')}
          </span>
        )}

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Icons.moreHorizontal className="h-4 w-4" />
              <span className="sr-only">{t('openMenu')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* View Details */}
            {canView && (
              <DropdownMenuItem asChild>
                <Link href={`/civil-registry/details?formId=${form.id}`}>
                  <Icons.eye className="mr-2 h-4 w-4" />
                  {t('viewDetails')}
                </Link>
              </DropdownMenuItem>
            )}

            {/* Upload Document */}
            {canUpload && (
              <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
                <Icons.printer className="mr-2 h-4 w-4" />
                {t('scanDocumentUpload')}
              </DropdownMenuItem>
            )}

            {/* View Attachments */}
            {hasAttachments && (
              <DropdownMenuItem asChild>
                <Link href={`/civil-registry/attachments?formId=${form.id}`}>
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  {t('viewAttachments')}
                </Link>
              </DropdownMenuItem>
            )}

            {/* Edit and Issue Certificate */}
            {canEdit && (
              <>
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Icons.folder className="mr-2 h-4 w-4" />
                  {t('editForm.title')}
                </DropdownMenuItem>
                {hasAttachments && (
                  <DropdownMenuItem onClick={() => setAnnotationFormOpen(true)}>
                    <Icons.files className="mr-2 h-4 w-4" />
                    {t('issueCertificate')}
                  </DropdownMenuItem>
                )}
              </>
            )}

            {/* Export Options */}
            {hasCertifiedCopy ? (
              <DropdownMenuItem asChild>
                <Link href={`/civil-registry/export?formId=${form.id}&format=zip`}>
                  <Icons.archive className="mr-2 h-4 w-4" />
                  {t('exportZip')}
                </Link>
              </DropdownMenuItem>
            ) : (
              hasAttachments && (
                <DropdownMenuItem asChild>
                  <Link href={`/civil-registry/download?formId=${form.id}`}>
                    <Icons.download className="mr-2 h-4 w-4" />
                    {t('downloadAttachment')}
                  </Link>
                </DropdownMenuItem>
              )
            )}

            {/* Delete Action */}
            {canDelete && (
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => setDeletionAlertOpen(true)}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                <Icons.trash className="mr-2 h-4 w-4" />
                {isLoading ? t('deleting') : t('delete')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialogs */}
      {canEdit && (
        <EditCivilRegistryFormDialog
          form={form}
          open={editDialogOpen}
          onOpenChangeAction={setEditDialogOpen}
          onSave={(updatedForm) => {
            toast.success(`${t('formUpdated')} ${updatedForm.id}!`)
            onUpdateAction?.(updatedForm)
            setEditDialogOpen(false)
          }}
        />
      )}

      {canDelete && (
        <DeleteConfirmationDialog
          open={deletionAlertOpen}
          onOpenChangeAction={setDeletionAlertOpen}
          onConfirmAction={() => {
            handleDelete()
            setDeletionAlertOpen(false)
          }}
          isLoading={isLoading}
        />
      )}

      {canUpload && (
        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChangeAction={setUploadDialogOpen}
          onUploadSuccess={handleUploadSuccess}
          formId={form.id}
          formType={form.formType}
          registryNumber={form.registryNumber}
        />
      )}

      {/* Form Type Specific Annotation Forms */}
      {form.formType === 'BIRTH' && (
        <BirthAnnotationForm
          open={annotationFormOpen}
          onOpenChange={setAnnotationFormOpen}
          onCancel={() => setAnnotationFormOpen(false)}
          formData={form}
        />
      )}
      {form.formType === 'DEATH' && (
        <DeathAnnotationForm
          open={annotationFormOpen}
          onOpenChange={setAnnotationFormOpen}
          onCancel={() => setAnnotationFormOpen(false)}
          formData={form}
        />
      )}
      {form.formType === 'MARRIAGE' && (
        <MarriageAnnotationForm
          open={annotationFormOpen}
          onOpenChange={setAnnotationFormOpen}
          onCancel={() => setAnnotationFormOpen(false)}
          formData={form}
        />
      )}
    </>
  )
}
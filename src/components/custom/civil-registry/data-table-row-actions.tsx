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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

// Extended types that preserve the original structure while adding CTC
type AttachmentWithCTC = Attachment & {
  certifiedCopies?: CertifiedCopy[]
}

type DocumentWithCTC = {
  id: string
  status: DocumentStatus
  createdAt: Date
  updatedAt: Date
  title: string
  metadata: any
  type: AttachmentType
  version: number
  description: string | null
  isLatest: boolean
  attachments?: AttachmentWithCTC[]
}

type BaseRegistryFormWithCTC = Omit<BaseRegistryFormWithRelations, 'document'> & {
  document?: DocumentWithCTC | null
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
    type: 'BIRTH_CERTIFICATE' as AttachmentType,
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
  const form = row.original as BaseRegistryFormWithCTC

  // Check for attachments and get the latest one
  const hasAttachments = form.document?.attachments && form.document.attachments.length > 0
  const latestAttachment = hasAttachments && form.document?.attachments
    ? [...(form.document.attachments || [])].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    : null

  // Check if latest attachment has CTC
  const hasCTC = latestAttachment?.certifiedCopies && latestAttachment.certifiedCopies.length > 0

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)
  const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

  // Delete action hook
  const { handleDelete, isLoading } = useDeleteFormAction({
    form: form as BaseRegistryFormWithRelations
  })

  // Permission checks
  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)
  const canExport = hasPermission(permissions, Permission.DOCUMENT_EXPORT) ||
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'

  // Handle file upload success
  const handleUploadSuccess = (fileData: { url: string; id: string }) => {
    const newAttachment = createAttachment(fileData)

    if (form.document) {
      const updatedForm: BaseRegistryFormWithRelations = {
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
      }
      onUpdateAction?.(updatedForm)
    }
  }

  // Handle export/download
  const handleExport = async () => {
    try {
      if (!canExport) {
        toast.error(t('You do not have permission to export documents'))
        return
      }

      if (!latestAttachment) {
        toast.error(t('No attachment found'))
        return
      }

      if (!hasCTC) {
        toast.error(t('Latest attachment needs a certified true copy (CTC) before you can export'))
        return
      }

      const response = await fetch(`/api/attachments/${latestAttachment.id}/export?zip=true`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Export failed')
      }

      const blob = await response.blob()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `${form.registryNumber}-${timestamp}-export.zip`

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      // Cleanup
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success(t('Export completed successfully'))
    } catch (error) {
      console.error('Export error:', error)
      const errorMessage = error instanceof Error ? error.message : t('Failed to export files')
      toast.error(errorMessage)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* CTC Badge */}
        {hasCTC && (
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
            {hasAttachments && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  if (hasCTC && canExport) {
                    handleExport()
                  }
                }}
                disabled={!hasCTC || !canExport}
                className={!hasCTC || !canExport ? "text-muted-foreground" : ""}
              >
                <Icons.download className="mr-2 h-4 w-4" />
                {t('Export')}
              </DropdownMenuItem>
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
          form={form as BaseRegistryFormWithRelations}
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
          formData={form as BaseRegistryFormWithRelations}
        />
      )}
      {form.formType === 'DEATH' && (
        <DeathAnnotationForm
          open={annotationFormOpen}
          onOpenChange={setAnnotationFormOpen}
          onCancel={() => setAnnotationFormOpen(false)}
          formData={form as BaseRegistryFormWithRelations}
        />
      )}
      {form.formType === 'MARRIAGE' && (
        <MarriageAnnotationForm
          open={annotationFormOpen}
          onOpenChange={setAnnotationFormOpen}
          onCancel={() => setAnnotationFormOpen(false)}
          formData={form as BaseRegistryFormWithRelations}
        />
      )}
    </>
  )
}
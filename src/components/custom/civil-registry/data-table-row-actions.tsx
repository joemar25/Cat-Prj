'use client'

import Link from 'next/link'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Permission, Attachment, CertifiedCopy } from '@prisma/client'

import { hasPermission } from '@/types/auth'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { useDeleteFormAction } from '@/components/custom/civil-registry/actions/delete-form-action'

import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { DeleteConfirmationDialog } from '@/components/custom/civil-registry/components/delete-confirmation-dialog'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'

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

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>
  onUpdateForm?: (updatedForm: BaseRegistryFormWithRelations) => void
  onDeleteForm?: (id: string) => void
}

export function DataTableRowActions({
  row,
  onUpdateForm,
  onDeleteForm,
}: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const form = row.original

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)
  const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

  const { handleDelete, isLoading } = useDeleteFormAction({ form })

  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)
  const canExport =
    hasPermission(permissions, Permission.DOCUMENT_EXPORT) ||
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'

  // Check for attachments and certified copies
  const attachments = form.document?.attachments || []
  const hasAttachments = attachments.length > 0
  // Note: If your Attachment type does not include certifiedCopies,
  // you might need to adjust this logic accordingly.
  const latestAttachment = attachments[0] as any | undefined
  const hasCTC = (latestAttachment?.certifiedCopies?.length ?? 0) > 0

  // Handle Export
  const handleExport = async () => {
    if (!canExport) {
      toast.error(t('You do not have permission to export documents'))
      return
    }

    if (!latestAttachment) {
      toast.error(t('No attachment found'))
      return
    }

    if (!hasCTC) {
      toast.error(
        t('Latest attachment needs a certified true copy (CTC) before you can export')
      )
      return
    }

    try {
      const response = await fetch(
        `/api/attachments/${latestAttachment.id}/export?zip=true`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Export failed')
      }

      const blob = await response.blob()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `${form.registryNumber}-${timestamp}-export.zip`

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success(t('Export completed successfully'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(error instanceof Error ? error.message : t('Failed to export files'))
    }
  }

  // Handle Annotation (Issue Certificate)
  const handleAnnotationClick = () => {
    if (hasCTC) {
      toast.info(
        t(
          'A certified true copy (CTC) already exists. You can add another issue certificate if needed.'
        )
      )
    }
    setAnnotationFormOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t('openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
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
              {t('uploadDocument')}
            </DropdownMenuItem>
          )}

          {/* Issue Certificate with dynamic label */}
          {canEdit && hasAttachments && (
            <DropdownMenuItem onClick={handleAnnotationClick}>
              <Icons.files className="mr-2 h-4 w-4" />
              {hasCTC ? t('Add Another Issue Certificate') : t('Issue Certificate')}
            </DropdownMenuItem>
          )}

          {/* Edit Form */}
          {canEdit && (
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Icons.folder className="mr-2 h-4 w-4" />
              {t('editForm.title')}
            </DropdownMenuItem>
          )}

          {/* Export Option */}
          {canExport && (
            <DropdownMenuItem
              onClick={handleExport}
              disabled={!hasCTC}
              className={!hasCTC ? 'text-muted-foreground' : ''}
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

      {/* Dialogs */}
      {canEdit && (
        <EditCivilRegistryFormDialog
          form={form}
          open={editDialogOpen}
          onOpenChangeAction={setEditDialogOpen}
          onSave={(updatedForm) => {
            toast.success(`${t('formUpdated')} ${updatedForm.id}!`)
            onUpdateForm?.(updatedForm)
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
            onDeleteForm?.(form.id)
          }}
          isLoading={isLoading}
        />
      )}

      {canUpload && (
        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChangeAction={setUploadDialogOpen}
          formId={form.id}
          formType={form.formType}
          registryNumber={form.registryNumber}
        />
      )}

      {/* Conditional Annotation Forms */}
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

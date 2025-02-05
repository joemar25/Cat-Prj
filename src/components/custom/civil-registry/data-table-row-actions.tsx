// src/components/custom/civil-registry/data-table-row-actions.tsx
'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Permission, Attachment } from '@prisma/client'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { useDeleteFormAction } from '@/components/custom/civil-registry/actions/delete-form-action'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteConfirmationDialog } from '@/components/custom/civil-registry/components/delete-confirmation-dialog'
import { Attachment as AttachmentType } from '@prisma/client'
import { FormSelection } from '../certified-true-copies/components/form-selection'
import Link from 'next/link'

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>
  onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

export function DataTableRowActions({ row, onUpdateAction }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const form = row.original

  // State variables for dialogs (only for actions that remain dialogs)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)
  // NEW: state for the FormSelection dialog (for issuing certificate)
  const [formSelectionOpen, setFormSelectionOpen] = useState(false)

  const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })

  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canView && (
            <DropdownMenuItem asChild>
              <Link href={`/civil-registry/details?formId=${form.id}`}>
                <Icons.eye className="mr-2 h-4 w-4" />
                {t('viewDetails')}
              </Link>
            </DropdownMenuItem>
          )}
          {canUpload && (
            <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
              <Icons.printer className="mr-2 h-4 w-4" />
              {t('scanDocumentUpload')}
            </DropdownMenuItem>
          )}
          {form.document?.attachments && form.document.attachments.length > 0 && (
            <DropdownMenuItem asChild>
              <Link href={`/civil-registry/attachments?formId=${form.id}`}>
                <Icons.fileText className="mr-2 h-4 w-4" />
                {t('viewAttachments')}
              </Link>
            </DropdownMenuItem>
          )}
          {canEdit && (
            <>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Icons.folder className="mr-2 h-4 w-4" />
                {t('editForm.title')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormSelectionOpen(true)}>
                <Icons.files className="mr-2 h-4 w-4" />
                {t('issueCertificate')}
              </DropdownMenuItem>
            </>
          )}
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
          onUploadSuccess={(fileUrl: string) => {
            // Create a minimal attachment object for UI purposes.
            const newAttachment = {
              fileUrl,
              fileName: fileUrl.split('/').pop() || fileUrl,
              fileSize: 0,
            } as unknown as AttachmentType

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
        <FormSelection
          open={formSelectionOpen}
          onOpenChangeAction={setFormSelectionOpen}
        />
      )}
    </>
  )
}

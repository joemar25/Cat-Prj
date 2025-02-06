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
import Link from 'next/link'

// Import the annotation forms directly
import BirthAnnotationForm from '@/components/custom/forms/annotations/birth-cert-annotation'
import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation'
import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'

// Extend the type locally so we can check for certified copies.
import { CertifiedCopy } from '@prisma/client'
type FormWithCTC = BaseRegistryFormWithRelations & { certifiedCopies?: CertifiedCopy[] }

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>
  onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

export function DataTableRowActions({ row, onUpdateAction }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const form = row.original

  // Typecast the form to include certifiedCopies.
  const formWithCTC = form as FormWithCTC
  const hasCertifiedCopy = formWithCTC.certifiedCopies && formWithCTC.certifiedCopies.length > 0
  const hasAttachments = form.document?.attachments && form.document.attachments.length > 0

  // State variables for dialogs (only for actions that use dialogs)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletionAlertOpen, setDeletionAlertOpen] = useState(false)
  // State for opening the annotation form dialog (for issuing certificate)
  const [annotationFormOpen, setAnnotationFormOpen] = useState(false)

  const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })

  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* If a certified copy exists, display a badge */}
        {hasCertifiedCopy && (
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
            {t('ctcIssued')}
          </span>
        )}
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
            {hasAttachments && (
              <DropdownMenuItem asChild>
                <Link href={`/civil-registry/attachments?formId=${form.id}`}>
                  <Icons.fileText className="mr-2 h-4 w-4" />
                  {t('viewAttachments')}
                </Link>
              </DropdownMenuItem>
            )}
            {/* Export options: if a certified copy exists, export as zip; otherwise, allow solo download */}
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
            {canEdit && (
              <>
                {/* <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Icons.folder className="mr-2 h-4 w-4" />
                  {t('editForm.title')}
                </DropdownMenuItem> */}
                {hasAttachments && (
                  <DropdownMenuItem onClick={() => setAnnotationFormOpen(true)}>
                    <Icons.files className="mr-2 h-4 w-4" />
                    {t('issueCertificate')}
                  </DropdownMenuItem>
                )}
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
      </div>

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

      {/* Annotation Form Dialogs based on form type.
          Here we pass the typed form data (via the prop "formData") instead of the generic "row". */}
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

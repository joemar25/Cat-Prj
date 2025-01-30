'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { FormType, Permission } from '@prisma/client'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { FileUploadDialog } from '@/components/custom/civil-registry/components/file-upload'
import { useDeleteFormAction } from '@/components/custom/civil-registry/actions/delete-form-action'
import { ViewDetailsDialog } from '@/components/custom/civil-registry/components/view-details-dialog'
import { usePrintDocumentAction } from '@/components/custom/civil-registry/actions/print-document-action'
import { EditCivilRegistryFormDialog } from '@/components/custom/civil-registry/components/edit-civil-registry-form-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps {
  row: Row<BaseRegistryFormWithRelations>
  onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

const formTypeLabels: Record<FormType, string> = {
  MARRIAGE: 'Marriage (Form 97)',
  BIRTH: 'Birth (Form 102)',
  DEATH: 'Death (Form 103)',
}

export function DataTableRowActions({ row, onUpdateAction }: DataTableRowActionsProps) {
  const { t } = useTranslation()
  const { permissions } = useUser()
  const form = row.original
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })
  const { handlePrintDocument } = usePrintDocumentAction({
    documentUrl: form.documentUrl,
    registryNumber: form.registryNumber,
  })

  const canView = hasPermission(permissions, Permission.DOCUMENT_READ)
  const canEdit = hasPermission(permissions, Permission.DOCUMENT_UPDATE)
  const canDelete = hasPermission(permissions, Permission.DOCUMENT_DELETE)
  const canUpload = hasPermission(permissions, Permission.DOCUMENT_CREATE)
  const canPrint = hasPermission(permissions, Permission.DOCUMENT_VERIFY)

  return (
    <>
      {canUpload && (
        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChangeAction={setUploadDialogOpen}
          onUploadSuccess={(fileUrl) => onUpdateAction?.({ ...form, documentUrl: fileUrl })}
          formId={form.id}
          formType={form.formType}
          registryNumber={form.registryNumber}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <Icons.moreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canView && (
            <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
              <Icons.eye className='mr-2 h-4 w-4' />
              {t('viewDetails')}
            </DropdownMenuItem>
          )}
          {canUpload && (
            <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
              <Icons.add className='mr-2 h-4 w-4' />
              {t('importDocument')}
            </DropdownMenuItem>
          )}
          {canPrint && form.documentUrl && (
            <DropdownMenuItem onClick={handlePrintDocument}>
              <Icons.printer className='mr-2 h-4 w-4' />
              {t('Print Document')}
            </DropdownMenuItem>
          )}
          {canEdit && (
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Icons.file className='mr-2 h-4 w-4' />
              {t('issueCertificate')}
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={handleDelete}
              disabled={isLoading}
              className='text-destructive focus:text-destructive'
            >
              <Icons.trash className='mr-2 h-4 w-4' />
              {isLoading ? t('deleting') : t('delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canEdit && (
        <EditCivilRegistryFormDialog
          form={form}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={(updatedForm) => {
            toast.success(`Form ${updatedForm.id} has been updated successfully!`)
            onUpdateAction?.(updatedForm)
            setEditDialogOpen(false)
          }}
        />
      )}

      {canView && <ViewDetailsDialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen} form={form} />}
    </>
  )
}

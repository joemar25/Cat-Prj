'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { FormType } from '@prisma/client'
import { Row } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
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
  const { data: session } = useSession()
  const form = row.original
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const { handleDelete, isLoading } = useDeleteFormAction({ form, onUpdateAction })
  const { handlePrintDocument } = usePrintDocumentAction({
    documentUrl: form.documentUrl,
    registryNumber: form.registryNumber,
  })

  const canManageForms = hasPermission(session?.user?.permissions ?? [], 'DOCUMENTS_MANAGE')
  if (!canManageForms) return null

  return (
    <>
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChangeAction={setUploadDialogOpen}
        onUploadSuccess={(fileUrl) => onUpdateAction?.({ ...form, documentUrl: fileUrl })}
        formId={form.id}
        formType={form.formType}
        registryNumber={form.registryNumber}
      />

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
          <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
            <Icons.eye className='mr-2 h-4 w-4' />
            {t('viewDetails')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUploadDialogOpen(true)}>
            <Icons.add className='mr-2 h-4 w-4' />
            {t('importDocument')}
          </DropdownMenuItem>
          {form.documentUrl && (
            <DropdownMenuItem onClick={handlePrintDocument}>
              <Icons.printer className='mr-2 h-4 w-4' />
              {t('Print Document')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Icons.file className='mr-2 h-4 w-4' />
            {t('issueCertificate')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleDelete}
            disabled={isLoading}
            className='text-destructive focus:text-destructive'
          >
            <Icons.trash className='mr-2 h-4 w-4' />
            {isLoading ? t('deleting') : t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      <ViewDetailsDialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen} form={form} />
    </>
  )
}
// src/components/custom/civil-registry/components/view-attachments-dialog.tsx
'use client'

import { Attachment } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { AttachmentsTable, AttachmentWithCertifiedCopies } from './attachment-table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ViewAttachmentsDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    attachments: Attachment[]
    // Now required: the form data for displaying details and pre-filling annotation forms.
    formData: BaseRegistryFormWithRelations
}

export function ViewAttachmentsDialog({
    open,
    onOpenChangeAction,
    attachments,
    formData,
}: ViewAttachmentsDialogProps) {
    // Sort attachments by uploadedAt descending (latest first)
    const sortedAttachments = [...attachments].sort((a, b) => {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="w-full max-w-3xl sm:max-w-[90vw] h-[90vh] p-4 overflow-auto">
                <DialogHeader className="items-start">
                    <DialogTitle className="text-left">Attachments</DialogTitle>
                    <DialogDescription className="text-left">
                        {`Attachments for Registry No. ${formData.registryNumber} (Form ${formData.formNumber})`}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 overflow-x-auto">
                    {sortedAttachments.length > 0 ? (
                        <AttachmentsTable
                            attachments={sortedAttachments as AttachmentWithCertifiedCopies[]}
                            // Pass formType and formData from the required formData prop.
                            formType={formData.formType}
                            formData={formData}
                        />
                    ) : (
                        <p className="text-center text-sm text-muted-foreground">
                            No attachments available.
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChangeAction(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

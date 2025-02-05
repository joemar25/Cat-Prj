// src/components/custom/civil-registry/components/view-attachments-dialog.tsx
'use client'

import React from 'react'
import { Attachment } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { AttachmentsTable, AttachmentWithCertifiedCopies } from './attachment-table'

interface ViewAttachmentsDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    attachments: Attachment[]
}

export function ViewAttachmentsDialog({
    open,
    onOpenChangeAction,
    attachments,
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
                        Here is a list of attachments associated with the document.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 overflow-x-auto">
                    {sortedAttachments.length > 0 ? (
                        <AttachmentsTable
                            attachments={sortedAttachments as AttachmentWithCertifiedCopies[]}
                        // Optionally, pass callbacks for delete or adding certified copies here.
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

'use client'

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Attachments</DialogTitle>
                    <DialogDescription>
                        Here is a list of attachments associated with the document.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {sortedAttachments.length > 0 ? (
                        <ul className="space-y-2">
                            {sortedAttachments.map((attachment) => (
                                <li key={attachment.id} className="flex flex-col">
                                    <a
                                        href={attachment.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {attachment.fileName}
                                    </a>
                                    <span className="text-xs text-muted-foreground">
                                        Uploaded: {new Date(attachment.uploadedAt).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No attachments available.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChangeAction(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

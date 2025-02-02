'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { FormType } from '@prisma/client'

interface FileUploadDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onUploadSuccess?: (fileUrl: string) => void
    formId: string
    formType: FormType
    registryNumber: string
}

export function FileUploadDialog({
    open,
    onOpenChangeAction,
    onUploadSuccess,
    formId,
    formType,
    registryNumber,
}: FileUploadDialogProps) {
    const { data: session } = useSession()

    if (!session) {
        redirect('/')
    }

    const userId = session.user.id

    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload.')
            return
        }

        setIsLoading(true)

        try {
            let documentId: string | undefined

            // Step 0: Fetch the current form to check if it already has a document.
            const formResponse = await fetch(`/api/forms/${formId}`, {
                method: 'GET',
            })
            const formJson = await formResponse.json()
            if (!formResponse.ok) {
                throw new Error(formJson.error || 'Failed to fetch form data')
            }
            // If a document already exists, reuse its id.
            documentId = formJson.data?.documentId

            if (!documentId) {
                // Step 1: Create a new Document record because none exists
                const documentResponse = await fetch('/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type:
                            formType === 'BIRTH'
                                ? 'BIRTH_CERTIFICATE'
                                : formType === 'DEATH'
                                    ? 'DEATH_CERTIFICATE'
                                    : 'MARRIAGE_CERTIFICATE',
                        title: `${formType} Document - ${registryNumber}`,
                        status: 'PENDING',
                    }),
                })

                const documentJson = await documentResponse.json()
                console.log('Document API response:', documentJson)

                if (!documentResponse.ok) {
                    throw new Error(
                        `Document creation failed: ${documentJson.error || 'Unknown error'}`
                    )
                }

                documentId = documentJson.data?.id
                if (!documentId) {
                    throw new Error(
                        'Document creation failed: Missing document ID in response'
                    )
                }

                // Step 1b: Update the form with the new documentId
                const updateFormResponse = await fetch(`/api/forms/${formId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ documentId }),
                })

                const updateFormJson = await updateFormResponse.json()
                console.log('Form update after document creation:', updateFormJson)
                if (!updateFormResponse.ok) {
                    throw new Error(`Form update failed: ${JSON.stringify(updateFormJson)}`)
                }
            } else {
                console.log('Reusing existing documentId:', documentId)
            }

            // Step 2: Upload the file
            const formData = new FormData()
            formData.append('file', file)
            formData.append('referenceNumber', registryNumber)

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const uploadJson = await uploadResponse.json()
            console.log('Upload API response:', uploadJson)

            if (!uploadResponse.ok) {
                throw new Error(
                    `File upload failed: ${uploadJson.error || 'Unknown error'}`
                )
            }

            const fileUrl = uploadJson.filepath
            if (!fileUrl) {
                throw new Error('File upload failed: Missing file URL in response')
            }

            // Step 3: Create attachment record
            const attachmentPayload = {
                userId,
                documentId,
                type: `${formType}_CERTIFICATE`,
                fileUrl,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
            }

            console.log('Sending attachment payload:', attachmentPayload)

            const attachmentResponse = await fetch('/api/attachments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attachmentPayload),
            })

            const attachmentJson = await attachmentResponse.json()
            console.log('Attachment API response:', attachmentJson)

            if (!attachmentResponse.ok) {
                throw new Error(
                    `Attachment creation failed: ${JSON.stringify(attachmentJson)}`
                )
            }

            if (!attachmentJson.success) {
                throw new Error('Attachment creation failed: No success response')
            }

            toast.success('File uploaded successfully!')
            onUploadSuccess?.(fileUrl)
            onOpenChangeAction(false)
        } catch (error) {
            console.error('Upload process error:', error)
            toast.error(
                error instanceof Error ? error.message : 'Failed to upload file'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Select a file to upload. You can preview it before confirming.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            Select File
                        </Button>
                    </div>

                    {file && (
                        <div className="mt-4">
                            <p className="text-sm font-medium">Selected File:</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{file.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    ({(file.size / 1024).toFixed(2)} KB)
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChangeAction(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

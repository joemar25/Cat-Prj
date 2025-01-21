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

interface FileUploadDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onUploadSuccess?: (fileUrl: string) => void
    referenceNumber?: string
}

export function FileUploadDialog({
    open,
    onOpenChangeAction,
    onUploadSuccess,
    referenceNumber,
}: FileUploadDialogProps) {
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

        const formData = new FormData()
        formData.append('file', file)

        // Add reference number to formData if available
        if (referenceNumber) {
            formData.append('referenceNumber', referenceNumber)
        }

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload file')
            }

            toast.success('File uploaded successfully!')
            // Use reference number in the file path if available
            const fileUrl = `/assets/${referenceNumber || file.name.replaceAll(' ', '_')}`
            onUploadSuccess?.(fileUrl)
            onOpenChangeAction(false)
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload file')
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
                    {/* File Input */}
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

                    {/* File Preview */}
                    {file && (
                        <div className="mt-4">
                            <p className="text-sm font-medium">Selected File:</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {file.name}
                                </span>
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
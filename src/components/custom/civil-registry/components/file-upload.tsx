'use client'

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"
import { useState, useCallback } from "react"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface FileUploadDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onUploadSuccess?: (fileData: { url: string; id: string }) => void
    formId: string
    formType: string
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
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        // Create preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        try {
            setIsUploading(true)

            // Upload file
            const formData = new FormData()
            formData.append("file", file)
            formData.append("formId", formId)
            formData.append("formType", formType)
            formData.append("registryNumber", registryNumber)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Upload failed")
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error("Upload failed")
            }

            toast.success("File uploaded successfully")
            onUploadSuccess?.({ url: data.url, id: data.id })
            onOpenChangeAction(false)
        } catch (error) {
            console.error("Upload error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to upload file")
        } finally {
            setIsUploading(false)
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [formId, formType, registryNumber, onUploadSuccess, onOpenChangeAction, preview])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        },
        maxSize: 10485760, // 10MB
        multiple: false
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                            isDragActive && "border-primary bg-primary/10"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2">
                            <Icons.upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Drag & drop a file here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supported formats: JPEG, PNG, PDF (max 10MB)
                            </p>
                        </div>
                    </div>

                    {preview && (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                            {preview.endsWith('.pdf') ? (
                                <iframe
                                    src={preview}
                                    className="w-full h-full"
                                    title="Preview"
                                />
                            ) : (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="object-contain w-full h-full"
                                />
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChangeAction(false)}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => document.querySelector('input')?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Select File"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
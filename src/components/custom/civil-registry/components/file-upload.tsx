"use client"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { FormType } from "@prisma/client"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useDropzone } from "react-dropzone"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import Image from "next/image"

interface FileUploadDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onUploadSuccess?: (fileData: { url: string; id: string }) => void
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
        redirect("/")
    }

    const userId = session.user.id

    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setPreviewUrl(null)
        }
    }, [file])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        },
        maxSize: 10485760, // 10MB
        multiple: false
    })

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload.")
            return
        }

        setIsLoading(true)

        try {
            let documentId: string | undefined

            const formResponse = await fetch(`/api/forms/${formId}`, {
                method: "GET",
            })
            const formJson = await formResponse.json()
            if (!formResponse.ok) {
                throw new Error(formJson.error || "Failed to fetch form data")
            }

            documentId = formJson.data?.documentId

            if (!documentId) {
                const documentResponse = await fetch("/api/documents", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type:
                            formType === "BIRTH"
                                ? "BIRTH_CERTIFICATE"
                                : formType === "DEATH"
                                    ? "DEATH_CERTIFICATE"
                                    : "MARRIAGE_CERTIFICATE",
                        title: `${formType} Document - ${registryNumber}`,
                        status: "PENDING",
                    }),
                })

                const documentJson = await documentResponse.json()
                if (!documentResponse.ok) {
                    throw new Error(`Document creation failed: ${documentJson.error || "Unknown error"}`)
                }

                documentId = documentJson.data?.id
                if (!documentId) {
                    throw new Error("Document creation failed: Missing document ID in response")
                }

                const updateFormResponse = await fetch(`/api/forms/${formId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ documentId }),
                })

                const updateFormJson = await updateFormResponse.json()
                if (!updateFormResponse.ok) {
                    throw new Error(`Form update failed: ${JSON.stringify(updateFormJson)}`)
                }
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("referenceNumber", registryNumber)

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text()
                console.error("Upload failed response:", errorText)
                throw new Error(`File upload failed: ${errorText || "Unknown error"}`)
            }

            let uploadJson
            try {
                uploadJson = await uploadResponse.json()
            } catch (e) {
                throw new Error("Invalid JSON response from server")
            }

            const fileUrl = uploadJson.filepath
            if (!fileUrl) {
                throw new Error("File upload failed: Missing file URL in response")
            }

            const attachmentPayload = {
                userId,
                documentId,
                type: `${formType}_CERTIFICATE`,
                fileUrl,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
            }

            const attachmentResponse = await fetch("/api/attachments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attachmentPayload),
            })

            const attachmentJson = await attachmentResponse.json()
            if (!attachmentResponse.ok || !attachmentJson.success) {
                throw new Error(`Attachment creation failed: ${JSON.stringify(attachmentJson)}`)
            }

            toast.success("File uploaded successfully!")
            onUploadSuccess?.({ url: fileUrl, id: documentId })
            onOpenChangeAction(false)
        } catch (error) {
            console.error("Upload process error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to upload file")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-4">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Drag & drop a file, or click to select. Supported formats: JPEG, PNG, PDF (max 10MB).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row h-[65vh]">
                    <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r overflow-y-auto">
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
                    </div>

                    <div className="md:w-1/2">
                        <div className="w-full overflow-y-auto flex items-center justify-center bg-muted cursor-pointer h-full border-2 border-dotted border-gray-400">
                            {file && previewUrl ? (
                                file.type.startsWith("application/pdf") ? (
                                    <iframe src={previewUrl} title="PDF Preview" className="h-full w-full border rounded" />
                                ) : file.type.startsWith("image/") ? (
                                    <Image
                                        src={previewUrl}
                                        width={720}
                                        height={1080}
                                        alt="Preview"
                                        className="object-contain"
                                    />
                                ) : (
                                    <p className="text-lg text-muted-foreground">
                                        Preview not available for this file type.
                                    </p>
                                )
                            ) : (
                                <p className="text-lg text-center flex items-center justify-center text-muted-foreground w-full h-[400px]">
                                    No file selected. The preview will appear here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChangeAction(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
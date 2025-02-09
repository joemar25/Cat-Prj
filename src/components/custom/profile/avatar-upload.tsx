'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarUploadProps {
    currentImage: string | null | undefined
    userName: string
    onUploadCompleteAction: (imageUrl: string) => void
    isEditingMode?: boolean
}

export function AvatarUpload({ currentImage, userName, onUploadCompleteAction, isEditingMode = false }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => setPreviewImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleFileUpload = async () => {
        if (!fileInputRef.current?.files?.[0]) return

        const file = fileInputRef.current.files[0]

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload-avatar')

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100)
                setUploadProgress(progress)
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText)
                onUploadCompleteAction(data.imageUrl)
                toast.success('Avatar updated successfully')
                setPreviewImage(null)
            } else {
                toast.error('Failed to upload avatar')
            }
            setIsUploading(false)
            setUploadProgress(0)
        }

        xhr.onerror = () => {
            toast.error('Failed to upload avatar')
            setIsUploading(false)
            setUploadProgress(0)
        }

        const formData = new FormData()
        formData.append('file', file)
        setIsUploading(true)
        xhr.send(formData)
    }

    const handleRemove = async () => {
        if (isEditingMode) {
            onUploadCompleteAction('')
            setPreviewImage(null)
            toast.success('Selected picture removed')
        } else {
            try {
                const response = await fetch('/api/upload-avatar', {
                    method: 'DELETE'
                })

                if (!response.ok) {
                    throw new Error('Failed to remove avatar')
                }

                onUploadCompleteAction('')
                setPreviewImage(null)
                toast.success('Avatar removed successfully')
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to remove avatar')
            }
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => setPreviewImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    const showDeleteButton = (currentImage || previewImage) && !isEditingMode && !isUploading && !previewImage

    return (
        <div className="w-full max-w-2xl p-8 mx-auto">
            <div
                className="p-8 shadow-lg rounded-2xl flex flex-col items-center gap-6 border-4 border-dashed transition cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Avatar className="h-36 w-36 cursor-pointer relative group" onClick={handleAvatarClick}>
                    <AvatarImage src={previewImage || currentImage || undefined} alt={userName} />
                    <AvatarFallback className="text-2xl">
                        {userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    <div className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                        <Icons.camera className="h-10 w-10" />
                    </div>
                </Avatar>

                {isUploading && (
                    <div className="w-full space-y-2">
                        <div className="w-full rounded-full h-3 bg-gray-200">
                            <div
                                className="h-3 rounded-full bg-blue-500 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                            Uploading... {uploadProgress}%
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 justify-center items-center">
                    {previewImage && !isUploading && (
                        <Button
                            variant="default"
                            size="lg"
                            onClick={handleFileUpload}
                        >
                            <Icons.check className="mr-2 h-5 w-5" />
                            Confirm Upload
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="lg"
                        className="relative"
                        disabled={isUploading}
                        onClick={handleAvatarClick}
                    >
                        <Icons.upload className="mr-2 h-5 w-5" />
                        Select Photo
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            accept="image/*"
                            disabled={isUploading}
                        />
                    </Button>

                    {showDeleteButton && (
                        <Button
                            variant="ghost"
                            size="lg"
                            className="text-destructive"
                            onClick={handleRemove}
                        >
                            <Icons.trash className="mr-2 h-5 w-5" />
                            Remove
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
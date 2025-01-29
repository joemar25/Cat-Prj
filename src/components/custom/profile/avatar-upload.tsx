'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarUploadProps {
    currentImage: string | null | undefined
    userName: string
    onUploadCompleteAction: (imageUrl: string) => void
}

export function AvatarUpload({ currentImage, userName, onUploadCompleteAction }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload avatar')
            }

            const data = await response.json()
            onUploadCompleteAction(data.imageUrl)
            toast.success('Avatar updated successfully')
        } catch (error) {
            console.error('Avatar upload error:', error)
            toast.error('Failed to upload avatar')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 cursor-pointer relative group">
                <AvatarImage src={currentImage ?? undefined} alt={userName} />
                <AvatarFallback className="text-xl">
                    {userName?.charAt(0).toUpperCase()}
                </AvatarFallback>
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                    <Icons.camera className="h-8 w-8 text-white" />
                </div>
            </Avatar>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="relative"
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Icons.upload className="mr-2 h-4 w-4" />
                            Upload Photo
                        </>
                    )}
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileSelect}
                        accept="image/*"
                        disabled={isUploading}
                    />
                </Button>
                {currentImage && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => onUploadCompleteAction('')}
                        disabled={isUploading}
                    >
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                )}
            </div>
        </div>
    )
}
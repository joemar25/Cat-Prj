'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProfileWithUser } from '@/types/user-profile'
import { ProfileForm } from './profile-form'
import { PasswordForm } from './password-form'

export default function Profile({ userId, profile }: { userId: string; profile: ProfileWithUser }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isPasswordMode, setIsPasswordMode] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const { update } = useSession()
    const router = useRouter()

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

        setIsUploadingAvatar(true)
        toast.loading('Uploading avatar...')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const uploadResponse = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData,
            })

            if (!uploadResponse.ok) {
                throw new Error(await uploadResponse.text() || 'Failed to upload avatar')
            }

            const { imageUrl } = await uploadResponse.json()

            const profileResponse = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageUrl,
                    name: profile?.user?.name,
                    username: profile?.user?.username,
                })
            })

            if (!profileResponse.ok) {
                throw new Error(await profileResponse.text() || 'Failed to update profile')
            }

            const result = await profileResponse.json()

            if (result.success) {
                await update({
                    ...profile?.user,
                    image: imageUrl
                })

                toast.success('Avatar updated successfully')
                router.refresh()
            } else {
                throw new Error(result.error || 'Failed to update profile')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update avatar')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    return (
        <div className="w-full p-6">
            <div className="flex items-center space-x-4 mb-8">
                <div className="relative group">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.user?.image ?? undefined} alt={profile?.user?.name} />
                        <AvatarFallback>{profile?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                    {isUploadingAvatar ? (
                                        <Icons.spinner className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <Icons.camera className="h-6 w-6 text-white" />
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={isUploadingAvatar}
                                    />
                                </label>
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{profile?.user?.name}</h1>
                    <p className="text-sm text-muted-foreground">{profile?.user?.email}</p>
                    {profile?.user?.username && (
                        <p className="text-sm text-muted-foreground">@{profile.user.username}</p>
                    )}
                </div>
            </div>

            {!isPasswordMode && (
                <ProfileForm
                    profile={profile}
                    isEditing={isEditing}
                    onEditingChangeAction={setIsEditing}
                />
            )}

            {isPasswordMode && (
                <PasswordForm
                    userId={userId}
                    onCancel={() => {
                        setIsPasswordMode(false)
                        setIsEditing(true)
                    }}
                    onSuccess={() => {
                        setIsEditing(false)
                        setIsPasswordMode(false)
                    }}
                />
            )}

            <div className="mt-4 flex gap-2">
                {!isEditing && !isPasswordMode && (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                        <Icons.edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                )}

                {isEditing && !isPasswordMode && (
                    <>
                        <Button type="button" variant="outline" onClick={() => setIsPasswordMode(true)}>
                            <Icons.key className="mr-2 h-4 w-4" />
                            Change Password
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileWithUser } from '@/types/user-profile'
import { ProfileForm } from './profile-form'
import { PasswordForm } from './password-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AvatarUpload } from './avatar-upload'

interface ProfileProps {
    userId: string
    profile: ProfileWithUser
    isLoading: boolean
}

export default function Profile({ userId, profile, isLoading }: ProfileProps) {
    const [isPasswordMode, setIsPasswordMode] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
    const { update } = useSession()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-8">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!profile.user) {
        return <div className="p-6 text-center text-red-500">User profile data is missing or incomplete.</div>
    }

    const user = profile.user

    const handleAvatarUploadComplete = async (imageUrl: string) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageUrl, name: user.name, username: user.username })
            })

            if (!response.ok) {
                throw new Error(await response.text() || 'Failed to update profile')
            }

            const result = await response.json()

            if (result.success) {
                await update({ ...user, image: imageUrl })
                router.refresh()
                setIsAvatarModalOpen(false)
            } else {
                throw new Error(result.error || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Failed to update avatar:', error)
        }
    }

    return (
        <div className="w-full p-6">
            <div className="p-6 shadow rounded-2xl mb-8 flex items-center space-x-4">
                <div className="relative group">
                    <Avatar className="h-16 w-16 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                        <AvatarImage src={user.image ?? undefined} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <div>
                    <h1 className="text-2xl font-bold leading-tight">{user.name}</h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.username && (
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {!isPasswordMode && (
                    <ProfileForm
                        profile={profile}
                        isEditing={isEditing}
                        onEditingChangeAction={setIsEditing}
                        isLoading={isLoading}
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

                <div className="flex gap-4">
                    {!isEditing && !isPasswordMode && (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                            <Icons.edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}

                    {isEditing && !isPasswordMode && (
                        <Button type="button" variant="outline" onClick={() => setIsPasswordMode(true)}>
                            <Icons.key className="mr-2 h-4 w-4" />
                            Change Password
                        </Button>
                    )}
                </div>
            </div>

            {/* Avatar Upload Modal */}
            <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
                <DialogContent className="p-6 shadow rounded-2xl w-full max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Change Profile Picture</DialogTitle>
                    </DialogHeader>

                    <AvatarUpload
                        currentImage={user.image}
                        userName={user.name}
                        onUploadCompleteAction={handleAvatarUploadComplete}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

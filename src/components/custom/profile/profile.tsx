'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileWithUser } from '@/types/user-profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { handleChangePassword } from '@/hooks/users-action'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { profileFormSchema, changePasswordSchema, ProfileFormValues, ChangePasswordFormValues } from '@/lib/validation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Profile({ userId, profile }: { userId: string; profile: ProfileWithUser }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isPasswordMode, setIsPasswordMode] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

    const { update } = useSession()
    const router = useRouter()

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: profile?.user?.username || '',
            name: profile?.user?.name || '',
            email: profile?.user?.email || '',
            dateOfBirth: profile?.dateOfBirth?.toISOString().split('T')[0] || '',
            phoneNumber: profile?.phoneNumber || '',
            address: profile?.address || '',
            city: profile?.city || '',
            state: profile?.state || '',
            country: profile?.country || '',
            postalCode: profile?.postalCode || '',
            bio: profile?.bio || '',
            occupation: profile?.occupation || '',
            gender: (profile?.gender as 'male' | 'female' | 'other') || undefined,
            nationality: profile?.nationality || '',
        },
    })

    const passwordForm = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

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

            const { imageUrl } = await response.json()

            // Update profile with new image URL
            const profileResponse = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageUrl,
                    // Include other current profile data
                    ...profileForm.getValues()
                }),
            })

            if (!profileResponse.ok) {
                throw new Error('Failed to update profile with new avatar')
            }

            const result = await profileResponse.json()

            if (result.success) {
                // Update session with new user data
                await update({
                    ...result.data.user,
                    image: imageUrl,
                })

                toast.success('Avatar updated successfully')
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to update avatar:', error)
            toast.error('Failed to update avatar')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const onProfileSubmit = async (data: ProfileFormValues) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update profile')
            }

            const result = await response.json()

            if (result.success) {
                // Update session with new user data
                await update({
                    ...result.data.user,
                })

                toast.success('Profile updated successfully')
                setIsEditing(false)
                router.refresh()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        }
    }

    const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
        try {
            const result = await handleChangePassword(userId, data)
            if (result.success) {
                toast.success('Password changed successfully')
                setIsEditing(false)
                setIsPasswordMode(false)
                passwordForm.reset()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Failed to change password:', error)
            toast.error('Failed to change password')
        }
    }

    const toggleEditMode = () => {
        if (isEditing && isPasswordMode) {
            setIsEditing(false)
            setIsPasswordMode(false)
        } else if (isEditing) {
            setIsPasswordMode(true)
        } else {
            setIsEditing(true)
            setIsPasswordMode(false)
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
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={profileForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value || ''} disabled={!isEditing} placeholder="Choose a username" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(profileFormSchema.shape)
                                .filter(([key]) => !['username', 'socialLinks', 'interests', 'website', 'bio'].includes(key))
                                .map(([key]) => {
                                    if (key === 'gender') {
                                        return (
                                            <FormField
                                                key={key}
                                                control={profileForm.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Gender</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value || undefined}
                                                            disabled={!isEditing}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="male">Male</SelectItem>
                                                                <SelectItem value="female">Female</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )
                                    }
                                    return (
                                        <FormField
                                            key={key}
                                            control={profileForm.control}
                                            name={key as keyof Omit<ProfileFormValues, 'socialLinks' | 'interests' | 'website' | 'bio'>}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value || ''} disabled={!isEditing} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                })}
                        </div>

                        <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} value={field.value || ''} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-start gap-2">
                            {isEditing ? (
                                <>
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        <Icons.save className="mr-2 h-4 w-4" />
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button type="button" onClick={toggleEditMode}>
                                    <Icons.edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}

            {isPasswordMode && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    >
                                                        {showCurrentPassword ? (
                                                            <Icons.eyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Icons.eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showNewPassword ? 'text' : 'password'}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? (
                                                            <Icons.eyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Icons.eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={passwordForm.control}
                                    name="confirmNewPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <Icons.eyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Icons.eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-start gap-2">
                                <Button type="button" variant="outline" onClick={toggleEditMode}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    <Icons.save className="mr-2 h-4 w-4" />
                                    Save Password
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

            {isEditing && !isPasswordMode && (
                <div className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsPasswordMode(true)}>
                        <Icons.key className="mr-2 h-4 w-4" />
                        Change Password
                    </Button>
                </div>
            )}
        </div>
    )
}
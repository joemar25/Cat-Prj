// src/components/custom/profile/profile.tsx
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
import { handleUpdateUserProfile, handleChangePassword } from '@/hooks/users-action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { profileFormSchema, changePasswordSchema, ProfileFormValues, ChangePasswordFormValues } from '@/lib/validation/zod'

export default function Profile({ userId, profile }: { userId: string; profile: ProfileWithUser }) {
    const [isEditing, setIsEditing] = useState(false) // Toggle for editing profile or changing password
    const [isPasswordMode, setIsPasswordMode] = useState(false) // Toggle between profile and password forms
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
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

    // Password change form
    const passwordForm = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    // Handle profile update
    const onProfileSubmit = async (data: ProfileFormValues) => {
        try {
            const result = await handleUpdateUserProfile(userId, data)
            if (result.success) {
                toast.success('Profile updated successfully')
                setIsEditing(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error('Failed to update profile')
        }
    }

    // Handle password change
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

    // Toggle between profile and password forms
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
            {/* User Info Section */}
            <div className="flex items-center space-x-4 mb-8">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.user?.image ?? undefined} alt={profile?.user?.name} />
                    <AvatarFallback>{profile?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{profile?.user?.name}</h1>
                    <p className="text-sm text-muted-foreground">{profile?.user?.email}</p>
                </div>
            </div>

            {/* Profile Form */}
            {!isPasswordMode && (
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile fields */}
                            {Object.entries(profileFormSchema.shape).map(([key]) => (
                                <FormField
                                    key={key}
                                    control={profileForm.control}
                                    name={key as keyof ProfileFormValues}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                                            <FormControl>
                                                {key === 'gender' ? (
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
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
                                                ) : (
                                                    <Input {...field} disabled={!isEditing} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {/* Bio Field */}
                        <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
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

            {/* Password Change Section */}
            {isPasswordMode && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Current Password */}
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

                                {/* New Password */}
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

                                {/* Confirm New Password */}
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

                            {/* Action Buttons */}
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

            {/* Toggle Button for Password Mode */}
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
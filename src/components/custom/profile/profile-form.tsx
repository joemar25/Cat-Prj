// src/components/custom/profile/profile-form.tsx
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileWithUser } from '@/types/user-profile'
import { ProfileFormValues, profileFormSchema } from '@/lib/validation/profile/profile-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProfileFormProps {
    profile: ProfileWithUser
    isEditing: boolean
    onEditingChange: (editing: boolean) => void
    onPasswordModeChange: () => void
}

export function ProfileForm({ profile, isEditing, onEditingChange }: ProfileFormProps) {
    const { update } = useSession()
    const router = useRouter()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: profile?.user?.username || '',
            name: profile?.user?.name || '',
            email: profile?.user?.email || '',
            dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.toISOString().split('T')[0] : '',
            phoneNumber: profile?.phoneNumber || null,
            address: profile?.address || null,
            city: profile?.city || null,
            state: profile?.state || null,
            country: profile?.country || null,
            postalCode: profile?.postalCode || null,
            bio: profile?.bio || null,
            occupation: profile?.occupation || null,
            gender: profile?.gender as 'male' | 'female' | 'other' || null,
            nationality: profile?.nationality || null,
        },
    })

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update profile')
            }

            const result = await response.json()
            if (result.success) {
                await update({ ...result.data.user })
                toast.success('Profile updated successfully')
                onEditingChange(false)
                router.refresh()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
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
                        .filter(([key]) => !['username', 'bio'].includes(key))
                        .map(([key]) => {
                            if (key === 'gender') {
                                return (
                                    <FormField
                                        key={key}
                                        control={form.control}
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
                                    control={form.control}
                                    name={key as keyof Omit<ProfileFormValues, 'bio'>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                                            <FormControl>
                                                {key === 'dateOfBirth' ? (
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        value={field.value || ''}
                                                        disabled={!isEditing}
                                                    />
                                                ) : (
                                                    <Input {...field} value={field.value || ''} disabled={!isEditing} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        })}
                </div>

                <FormField
                    control={form.control}
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
                            <Button type="button" variant="outline" onClick={() => onEditingChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Icons.save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        </>
                    ) : (
                        <Button type="button" onClick={() => onEditingChange(true)}>
                            <Icons.edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}
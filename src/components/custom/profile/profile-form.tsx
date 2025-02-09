'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ProfileWithUser } from '@/types/user-profile'
import { ProfileFormValues, profileFormSchema } from '@/lib/validation/profile/profile-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface ProfileFormProps {
    profile: ProfileWithUser
    isEditing: boolean
    isLoading: boolean
    onEditingChangeAction: (editing: boolean) => void
}

export function ProfileForm({ profile, isEditing, isLoading, onEditingChangeAction }: ProfileFormProps) {
    const { update } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: profile?.user?.username ?? '',
            name: profile?.user?.name ?? '',
            email: profile?.user?.email ?? '',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            phoneNumber: profile?.phoneNumber ?? '',
            address: profile?.address ?? '',
            city: profile?.city ?? '',
            state: profile?.state ?? '',
            country: profile?.country ?? '',
            postalCode: profile?.postalCode ?? '',
            bio: profile?.bio ?? '',
            occupation: profile?.occupation ?? '',
            gender: (profile?.gender as 'male' | 'female' | 'other') ?? undefined,
            nationality: profile?.nationality ?? '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        if (!isEditing) return
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    image: profile?.user?.image,
                })
            })

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error)
            }

            await update(result.data.user)
            toast.success('Profile updated successfully')
            onEditingChangeAction(false)
            router.refresh()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                ))}
                <div className="flex justify-start gap-2">
                    <Skeleton className="h-10 w-24" />  {/* Simulated Cancel Button */}
                    <Skeleton className="h-10 w-32" />  {/* Simulated Save Button */}
                </div>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">

                    {/* Personal Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                            disabled={!isEditing || isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
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
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['address', 'city', 'state', 'country', 'postalCode'] as const).map((fieldName) => (
                                <FormField
                                    key={fieldName}
                                    control={form.control}
                                    name={fieldName}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="occupation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occupation</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nationality"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nationality</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="p-6 shadow rounded-2xl">
                        <h2 className="text-xl font-semibold mb-4">Bio</h2>
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} value={field.value ?? ''} disabled={!isEditing || isSubmitting} className="h-32" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex justify-start gap-4">
                            <Button variant={"outline"} onClick={() => onEditingChangeAction(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>
            </form>
        </Form>
    )
}

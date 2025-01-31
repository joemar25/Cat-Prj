import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useTransition } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserWithRoleAndProfile } from '@/types/user'
import { profileFormSchema, ProfileFormValues } from '@/lib/validation/profile/profile-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface ProfileSectionProps {
    user: UserWithRoleAndProfile
    onPasswordChange: () => void
    onSave?: (user: UserWithRoleAndProfile) => void
}

export function ProfileSection({ user, onPasswordChange, onSave }: ProfileSectionProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
        defaultValues: {
            username: user.username || '',
            name: user.name || '',
            email: user.email || '',
            dateOfBirth: user.profile?.dateOfBirth?.toISOString().split('T')[0] || '',
            phoneNumber: user.profile?.phoneNumber || null,
            address: user.profile?.address || null,
            city: user.profile?.city || null,
            state: user.profile?.state || null,
            country: user.profile?.country || null,
            postalCode: user.profile?.postalCode || null,
            bio: user.profile?.bio || null,
            occupation: user.profile?.occupation || null,
            gender: (user.profile?.gender as 'male' | 'female' | 'other' | null) || null,
            nationality: user.profile?.nationality || null,
        }
    })

    useEffect(() => {
        if (user) {
            profileForm.reset({
                username: user.username || '',
                name: user.name || '',
                email: user.email || '',
                dateOfBirth: user.profile?.dateOfBirth?.toISOString().split('T')[0] || '',
                phoneNumber: user.profile?.phoneNumber || null,
                address: user.profile?.address || null,
                city: user.profile?.city || null,
                state: user.profile?.state || null,
                country: user.profile?.country || null,
                postalCode: user.profile?.postalCode || null,
                bio: user.profile?.bio || null,
                occupation: user.profile?.occupation || null,
                gender: (user.profile?.gender as 'male' | 'female' | 'other' | null) || null,
                nationality: user.profile?.nationality || null,
            })
        }
    }, [user, profileForm])

    const onSubmitProfile = async (data: ProfileFormValues) => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/users/${user.id}/profile`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })

                if (!response.ok) {
                    throw new Error('Failed to update profile')
                }

                const updatedUserData = await response.json()

                // Create a properly structured UserWithRoleAndProfile object
                const updatedUser: UserWithRoleAndProfile = {
                    ...user,
                    ...updatedUserData,
                    profile: {
                        ...user.profile,
                        ...updatedUserData.profile
                    },
                    roles: user.roles // Maintain existing roles
                }

                toast.success('Profile updated successfully')
                onSave?.(updatedUser)
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to update profile')
            }
        })
    }

    return (
        <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username field */}
                    <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter username" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name field */}
                    <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter name" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email field */}
                    <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter email" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date of Birth field */}
                    <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Number field */}
                    <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter phone number" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address field */}
                    <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter address" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* City field */}
                    <FormField
                        control={profileForm.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter city" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* State field */}
                    <FormField
                        control={profileForm.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter state" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country field */}
                    <FormField
                        control={profileForm.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter country" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Postal Code field */}
                    <FormField
                        control={profileForm.control}
                        name="postalCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter postal code" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Occupation field */}
                    <FormField
                        control={profileForm.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Occupation</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter occupation" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gender field */}
                    <FormField
                        control={profileForm.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value || undefined}
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

                    {/* Nationality field */}
                    <FormField
                        control={profileForm.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter nationality" value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Bio field */}
                <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Enter bio"
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={onPasswordChange}>
                        Change Password
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        Update Profile
                    </Button>
                </div>
            </form>
        </Form>
    )
}
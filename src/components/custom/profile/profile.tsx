'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileWithUser } from '@/types/user-profile'
import { handleUpdateUserProfile } from '@/hooks/users-action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Define the schema for the profile form
const profileFormSchema = z.object({
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    bio: z.string().optional(),
    occupation: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function Profile({ userId, profile }: { userId: string; profile: ProfileWithUser }) {
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<ProfileFormValues>({
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
            gender: profile?.gender || '',
            nationality: profile?.nationality || '',
        },
    })

    const onSubmit = async (data: ProfileFormValues) => {
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Grid Layout for Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="occupation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
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
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
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
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Bio Field */}
                    <FormField
                        control={form.control}
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    <Icons.save className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                            >
                                <Icons.edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    )
}
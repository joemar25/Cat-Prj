// src/components/custom/users/components/edit-user-dialog/change-password-form.tsx
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { handleChangePasswordForEditUser } from '@/hooks/users-action'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { profileChangePasswordSchema, type ProfileChangePasswordFormValues } from '@/lib/validation/profile/change-password'

interface ChangePasswordFormProps {
    userId: string
    onCancel: () => void
    onSuccess: () => void
}

export default function ChangePasswordForm({ userId, onCancel, onSuccess }: ChangePasswordFormProps) {
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<ProfileChangePasswordFormValues>({
        resolver: zodResolver(profileChangePasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const onSubmit = async (data: ProfileChangePasswordFormValues) => {
        setIsPending(true)
        console.log('Submitting password change request...', data);

        try {
            const result = await handleChangePasswordForEditUser(userId, {
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            });

            console.log('Password change result:', result);

            if (result.success) {
                toast.success('Password changed successfully');
                console.log('Success toast should trigger');
                onSuccess();
            } else {
                toast.error(result.message || 'Failed to change password');
                console.log('Error toast should trigger:', result.message);
            }
        } catch (error) {
            console.error('Unexpected error during password change:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
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
                        control={form.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm new password"
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

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Changing Password...
                            </>
                        ) : (
                            <>
                                <Icons.key className="mr-2 h-4 w-4" />
                                Change Password
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
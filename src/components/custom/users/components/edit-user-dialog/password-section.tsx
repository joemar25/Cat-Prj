// src\components\custom\users\components\edit-user-dialog\password-section.tsx
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ProfileNewPasswordFormValues, profileNewPasswordSchema } from '@/lib/validation/profile/change-password'

interface PasswordSectionProps {
    userId: string
    onCancel: () => void
}

export function PasswordSection({ userId, onCancel }: PasswordSectionProps) {
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPending, startTransition] = useTransition()

    const passwordForm = useForm<ProfileNewPasswordFormValues>({
        resolver: zodResolver(profileNewPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const onSubmitPassword = async (data: ProfileNewPasswordFormValues) => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/users/${userId}/change-password`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })

                if (!response.ok) {
                    throw new Error('Failed to change password')
                }

                toast.success('Password changed successfully')
                passwordForm.reset()
                onCancel()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to change password')
            }
        })
    }

    return (
        <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input {...field} type={showNewPassword ? 'text' : 'password'} placeholder="Enter new password" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={passwordForm.control} name="confirmNewPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input {...field} type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm new password" />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="flex justify-between">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={isPending}>Change Password</Button>
                </div>
            </form>
        </Form>
    )
}
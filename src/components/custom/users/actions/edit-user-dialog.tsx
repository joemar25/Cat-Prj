import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { User, Profile } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useTransition } from 'react'
import { profileFormSchema, ProfileFormValues } from '@/lib/validation/profile/profile-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProfileNewPasswordFormValues, profileNewPasswordSchema } from '@/lib/validation/profile/change-password'

interface UserWithProfile extends User {
  profile?: Profile | null
}

interface EditUserDialogProps {
  user: UserWithProfile
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onSave?: (user: User) => void
}

export function EditUserDialog({ user, open, onOpenChangeAction, onSave }: EditUserDialogProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
  })

  const passwordForm = useForm<ProfileNewPasswordFormValues>({
    resolver: zodResolver(profileNewPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  useEffect(() => {
    if (open && user) {
      profileForm.reset({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: user.profile?.dateOfBirth?.toISOString().split('T')[0] || '',
        phoneNumber: user.profile?.phoneNumber || '',
        address: user.profile?.address || '',
        city: user.profile?.city || '',
        state: user.profile?.state || '',
        country: user.profile?.country || '',
        postalCode: user.profile?.postalCode || '',
        bio: user.profile?.bio || '',
        occupation: user.profile?.occupation || '',
        gender: user.profile?.gender as 'male' | 'female' | 'other' || null,
        nationality: user.profile?.nationality || '',
      })
    }
  }, [open, user, profileForm])

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

        toast.success('Profile updated successfully')
        onOpenChangeAction(false)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update profile')
      }
    })
  }

  const onSubmitPassword = async (data: ProfileNewPasswordFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/change-password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to change password')
        }

        toast.success('Password changed successfully')
        passwordForm.reset()
        setShowPasswordForm(false)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to change password')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details or change their password.</DialogDescription>
        </DialogHeader>

        {!showPasswordForm ? (
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(profileFormSchema.shape).map((key) => (
                  <FormField key={key} control={profileForm.control} name={key as keyof ProfileFormValues} render={({ field }) => (
                    <FormItem>
                      <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                      <FormControl>
                        {key === 'gender' ? (
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : key === 'bio' ? (
                          <Textarea {...field} placeholder="Enter bio" value={field.value || ''} />
                        ) : (
                          <Input {...field} placeholder={`Enter ${key}`} value={field.value || ''} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setShowPasswordForm(true)}>Change Password</Button>
                <Button type="submit" disabled={isPending}>Update Profile</Button>
              </div>
            </form>
          </Form>
        ) : (
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
              <Button type="submit" disabled={isPending}>Change Password</Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useEffect, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Form } from '@/components/ui/form'
import { profileFormSchema, ProfileFormValues } from '@/lib/validation/profile/profile-form'
import { User, Profile } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
  const { update } = useSession()
  const router = useRouter()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (open && user) {
      form.reset({
        username: user.username || '',
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: user.profile?.dateOfBirth ? user.profile.dateOfBirth.toISOString().split('T')[0] : '',
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
  }, [open, user, form])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
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
        toast.success('Profile updated successfully')

        onOpenChangeAction(false)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details with the form below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(profileFormSchema.shape).map(([key]) => (
                <FormField key={key} control={form.control} name={key as keyof ProfileFormValues} render={({ field }) => (
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
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><Icons.check className="mr-2 h-4 w-4" /> Update User</>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

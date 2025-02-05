import { useState } from 'react'
import { ProfileSection } from '@/components/custom/users/components/edit-user-dialog/profile-section'
import { PasswordSection } from '@/components/custom/users/components/edit-user-dialog/password-section'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserWithRoleAndProfile } from '@/types/user'

interface EditUserDialogProps {
  user: UserWithRoleAndProfile
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onSave?: (user: UserWithRoleAndProfile) => void
}

export function EditUserDialog({ user, open, onOpenChangeAction, onSave }: EditUserDialogProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details or change their password.</DialogDescription>
        </DialogHeader>

        {!showPasswordForm ? (
          <ProfileSection
            user={user}
            onPasswordChange={() => setShowPasswordForm(true)}
            onSave={onSave}
          />
        ) : (
          <PasswordSection
            userId={user.id}
            onCancel={() => setShowPasswordForm(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
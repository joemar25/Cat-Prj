'use client'

import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { FormActionDialog } from './components/edit-user-dialog/form-action-dialog'

import { deactivateUser, deleteUser, enableUser, updateUserRole } from '@/hooks/users-action'
import { hasPermission } from '@/types/auth'
import { Permission } from '@prisma/client'
import { UserWithRoleAndProfile } from '@/types/user'
import { useUser } from '@/context/user-context'
import { useRoles } from '@/hooks/use-roles'
import { EditUserDialog } from './actions/edit-user-dialog'

interface DataTableRowActionsProps {
  row: Row<UserWithRoleAndProfile>
  onUpdateUser?: (updatedUser: UserWithRoleAndProfile) => void
  onDeleteUser?: (id: string) => void
}

export function DataTableRowActions({
  row,
  onUpdateUser,
  onDeleteUser,
}: DataTableRowActionsProps) {
  const user = row.original

  const { roles, loading: rolesLoading, error: rolesError } = useRoles()
  const { permissions } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Permission checks
  const canUpdateUser = hasPermission(permissions, Permission.USER_UPDATE)
  const canActivateUser = hasPermission(permissions, Permission.USER_ACTIVATE)
  const canDeactivateUser = hasPermission(permissions, Permission.USER_DEACTIVATE)
  const canDeleteUser = hasPermission(permissions, Permission.USER_DELETE)
  const canAssignRoles = hasPermission(permissions, Permission.ROLE_ASSIGN)

  // If the current user has neither update nor delete permissions, don't render any actions.
  if (!canUpdateUser && !canDeleteUser) return null

  // Determine if the user is disabled (not verified)
  const isUserDisabled = !user.emailVerified

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      const result = await enableUser(user.id)
      if (result.success) {
        const updatedUser = { ...user, emailVerified: true }
        onUpdateUser?.(updatedUser)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeactivate = async () => {
    setIsLoading(true)
    try {
      const result = await deactivateUser(user.id)
      if (result.success) {
        const updatedUser = { ...user, emailVerified: false }
        onUpdateUser?.(updatedUser)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowDisableDialog(false)
    }
  }

  const handleRoleUpdate = async () => {
    if (!selectedRole) return
    setIsLoading(true)
    try {
      const result = await updateUserRole(user.id, selectedRole)
      if (result.success && result.data) {
        const updatedUser = result.data as UserWithRoleAndProfile
        onUpdateUser?.(updatedUser)
        toast.success('Role updated successfully')
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to update role')
    } finally {
      setIsLoading(false)
      setShowRoleDialog(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success('User deleted successfully')
        onDeleteUser?.(user.id)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleEditUser = (updatedUser: UserWithRoleAndProfile) => {
    onUpdateUser?.(updatedUser)
    setShowEditDialog(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canUpdateUser && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Icons.pencil className="mr-2 h-4 w-4" /> Edit User
            </DropdownMenuItem>
          )}

          {canActivateUser && isUserDisabled && (
            <DropdownMenuItem onClick={handleEnable} disabled={isLoading}>
              <Icons.check className="mr-2 h-4 w-4" /> Enable
            </DropdownMenuItem>
          )}

          {canAssignRoles && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icons.user className="mr-2 h-4 w-4" /> Assign Role
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {rolesLoading ? (
                  <DropdownMenuItem disabled>Loading roles...</DropdownMenuItem>
                ) : rolesError ? (
                  <DropdownMenuItem className="text-destructive">
                    {rolesError}
                  </DropdownMenuItem>
                ) : (
                  roles.map((roleItem) => (
                    <DropdownMenuItem
                      key={roleItem.id}
                      onClick={() => {
                        setSelectedRole(roleItem.id)
                        setShowRoleDialog(true)
                      }}
                    >
                      {roleItem.name}
                      {user.roles.some(r => r.role.id === roleItem.id) && (
                        <Icons.check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          {canDeactivateUser && !isUserDisabled && (
            <DropdownMenuItem
              onClick={() => setShowDisableDialog(true)}
              className="text-destructive"
              disabled={isLoading}
            >
              <Icons.trash className="mr-2 h-4 w-4" /> Deactivate
            </DropdownMenuItem>
          )}

          {canDeleteUser && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
              disabled={isLoading}
            >
              <Icons.trash className="mr-2 h-4 w-4" /> Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChangeAction={setShowEditDialog}
        onSave={handleEditUser}
      />

      <FormActionDialog
        open={showRoleDialog}
        title="Confirm Role Change"
        description="Are you sure?"
        confirmText="Confirm"
        isLoading={isLoading}
        onConfirm={handleRoleUpdate}
        onCancel={() => setShowRoleDialog(false)}
      />

      <FormActionDialog
        open={showDisableDialog}
        title="Deactivate User"
        description="Are you sure?"
        confirmText="Deactivate"
        isLoading={isLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setShowDisableDialog(false)}
      />

      <FormActionDialog
        open={showDeleteDialog}
        title="Delete User"
        description="Are you sure?"
        confirmText="Delete"
        isLoading={isLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}
'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { deactivateUser, enableUser, updateUserRole } from '@/hooks/users-action'
import { hasPermission } from '@/types/auth'
import { Permission } from '@prisma/client'
import { Row } from '@tanstack/react-table'
import { useUser } from '@/context/user-context'
import { useState } from 'react'
import { toast } from 'sonner'
import { UserWithRoleAndProfile } from '@/types/user'
import { useRoles } from '@/hooks/use-roles'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DataTableRowActionsProps {
  row: Row<UserWithRoleAndProfile>
  onUpdateUser?: (updatedUser: UserWithRoleAndProfile) => void
}

export function DataTableRowActions({
  row,
  onUpdateUser,
}: DataTableRowActionsProps) {
  const { roles, loading: rolesLoading, error: rolesError } = useRoles()
  const user = row.original

  const { permissions } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)

  const canUpdateUser = hasPermission(permissions, Permission.USER_UPDATE)
  const canDeleteUser = hasPermission(permissions, Permission.USER_DELETE)
  const canAssignRoles = hasPermission(permissions, Permission.ROLE_ASSIGN)

  if (!canUpdateUser && !canDeleteUser) return null

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
    } catch (error) {
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
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
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
    } catch (error) {
      toast.error('Failed to update role')
    } finally {
      setIsLoading(false)
      setShowRoleDialog(false)
    }
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
            <DropdownMenuItem onClick={handleEnable}>
              <Icons.check className="mr-2 h-4 w-4" /> Enable
            </DropdownMenuItem>
          )}
          {canDeleteUser && (
            <DropdownMenuItem onClick={handleDeactivate} className="text-destructive">
              <Icons.trash className="mr-2 h-4 w-4" /> Deactivate
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
                  <DropdownMenuItem className="text-destructive">{rolesError}</DropdownMenuItem>
                ) : (
                  roles.map((role) => (
                    <DropdownMenuItem
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id)
                        setShowRoleDialog(true)
                      }}
                    >
                      {role.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for Role Confirmation */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign this role to <b>{user.name}</b>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRoleDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

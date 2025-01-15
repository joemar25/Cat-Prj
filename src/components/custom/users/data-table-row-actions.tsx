// src\components\custom\users\data-table-row-actions.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { deactivateUser, enableUser } from '@/hooks/users-action'
import { hasPermission } from '@/types/auth'
import { User } from '@prisma/client'
import { Row } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EditUserDialog } from './actions/edit-user-dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps {
  row: Row<User>
  onUpdateUser?: (updatedUser: User) => void
}

export function DataTableRowActions({
  row,
  onUpdateUser,
}: DataTableRowActionsProps) {
  const { data: session } = useSession()
  const user = row.original
  const [isLoading, setIsLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [showEnableAlert, setShowEnableAlert] = useState(false)
  const [showDeactivateAlert, setShowDeactivateAlert] = useState(false)

  const canManageUsers = hasPermission(
    session?.user?.permissions ?? [],
    'USERS_MANAGE'
  )
  if (!canManageUsers) return null

  const isCurrentUser = session?.user?.email === user.email

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      const result = await enableUser(user.id)
      if (result.success) {
        const updatedUser = {
          ...user,
          emailVerified: true
        }
        onUpdateUser?.(updatedUser)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error enabling user:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowEnableAlert(false)
    }
  }

  const handleDeactivate = async () => {
    setIsLoading(true)
    try {
      const result = await deactivateUser(user.id)
      if (result.success) {
        const updatedUser = {
          ...user,
          emailVerified: false
        }
        onUpdateUser?.(updatedUser)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowDeactivateAlert(false)
    }
  }

  const handleSave = (updatedUser: User) => {
    onUpdateUser?.(updatedUser)
    toast.success(`User ${updatedUser.name} has been updated successfully!`)
    setEditDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isCurrentUser}
          >
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setEditDialogOpen(true)}
            disabled={isCurrentUser}
          >
            <Icons.edit className="mr-2 h-4 w-4" />
            Edit
            {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(Disabled)</span>}
          </DropdownMenuItem>

          {!user.emailVerified ? (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => setShowEnableAlert(true)}
              disabled={isLoading || isCurrentUser}
              className="text-green-600 focus:text-green-600"
            >
              <Icons.check className="mr-2 h-4 w-4" />
              Enable
              {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(Disabled)</span>}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              onClick={() => setShowDeactivateAlert(true)}
              disabled={isLoading || isCurrentUser}
              className="text-destructive focus:text-destructive"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Deactivate
              {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(Disabled)</span>}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Enable User Alert Dialog */}
      <AlertDialog open={showEnableAlert} onOpenChange={setShowEnableAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enable User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to enable this user account? This will allow the user to access the system again.
            </AlertDialogDescription>
            <div className="mt-4 rounded-md bg-muted p-4">
              <div className="text-sm">
                <p><strong>User:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnable}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Enabling...' : 'Enable User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate User Alert Dialog */}
      <AlertDialog open={showDeactivateAlert} onOpenChange={setShowDeactivateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this user account? They will no longer be able to access the system.
            </AlertDialogDescription>
            <div className="mt-4 rounded-md bg-muted p-4">
              <div className="text-sm">
                <p><strong>User:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? 'Deactivating...' : 'Deactivate User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={user}
        open={editDialogOpen && !isCurrentUser}
        onOpenChangeAction={(open) => setEditDialogOpen(open)}
        onSave={handleSave}
      />

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the user.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Name</span>
              <span className='col-span-3'>{user.name}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Email</span>
              <span className='col-span-3'>{user.email}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Role</span>
              <span className='col-span-3'>{user.role}</span>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-medium'>Status</span>
              <span className='col-span-3'>
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
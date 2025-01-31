'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Role, Permission } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type RoleRow = Role & {
  permissions: Permission[]
  users: { id: string; name: string; email: string }[]
}

interface DataTableRowActionsProps {
  row: Row<RoleRow>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const role = row.original
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { permissions } = useUser()

  const canDelete = hasPermission(permissions, Permission.ROLE_DELETE)
  const canViewDetails = hasPermission(permissions, Permission.ROLE_READ)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete role')
      }

      toast.success(`Role deleted successfully!`)
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete role')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.more className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canViewDetails && (
            <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
              <Icons.view className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canViewDetails && (
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Role Details</DialogTitle>
              <DialogDescription>
                Detailed information about the role.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">{role.name}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{role.description || 'No description'}</p>
              </div>
              <div>
                <h4 className="font-medium">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <span key={permission} className="text-sm text-muted-foreground">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Assigned Users</h4>
                <div className="flex flex-col gap-1">
                  {role.users.map((user) => (
                    <p key={user.id} className="text-sm text-muted-foreground">
                      {user.name} ({user.email})
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Created At</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(role.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Last Updated</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(role.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
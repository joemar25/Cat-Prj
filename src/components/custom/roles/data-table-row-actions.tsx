'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Role, Permission } from '@prisma/client'
import { RoleDetailsDialog } from './components/role-details-dialog'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { permissions } = useUser()

  const canDelete = hasPermission(permissions, Permission.ROLE_DELETE)
  const canViewDetails = hasPermission(permissions, Permission.ROLE_READ)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete role')
      }

      toast.success('Role deleted successfully!')
      setConfirmDeleteOpen(false)
    } catch (error) {
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
          {canDelete && role.name !== 'Super Admin' && (
            <DropdownMenuItem
              onClick={() => setConfirmDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent>
          <RoleDetailsDialog role={role} onCloseAction={() => setViewDetailsOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <div className="text-sm text-muted-foreground">
              Are you sure you want to delete the role "{role.name}"? This action cannot be undone.
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
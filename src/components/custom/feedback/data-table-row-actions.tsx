'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Feedback, Permission } from '@prisma/client'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type FeedbackRow = Feedback & {
  user: {
    name: string
    email: string
    image: string | null
  } | null
}

interface DataTableRowActionsProps {
  row: Row<FeedbackRow>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const feedback = row.original
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { permissions } = useUser()

  const canDelete = hasPermission(permissions, Permission.FEEDBACK_DELETE)
  const canViewDetails = hasPermission(permissions, Permission.FEEDBACK_READ)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete feedback')
      }

      toast.success(`Feedback deleted successfully!`)
      setConfirmDeleteOpen(false) // Close dialog after successful deletion
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete feedback')
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
              onClick={() => setConfirmDeleteOpen(true)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)} disabled={isDeleting}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : 'Yes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      {canViewDetails && (
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="max-w-lg p-6 space-y-6 rounded-lg shadow-xl">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl font-semibold text-primary dark:text-white">Feedback Details</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground dark:text-gray-300">
                Detailed information about the feedback submission.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 border rounded-lg shadow-sm">
              <h4 className="font-medium text-lg dark:text-white">Feedback</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feedback.feedback}</p>
              <hr className="my-3 border-gray-300 dark:border-gray-700" />

              <h4 className="font-medium text-lg dark:text-white">Submitted By</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feedback.user ? feedback.user.name : 'Anonymous'}
              </p>
              <hr className="my-3 border-gray-300 dark:border-gray-700" />

              <h4 className="font-medium text-lg dark:text-white">Email</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feedback.user ? feedback.user.email : 'N/A'}
              </p>
              <hr className="my-3 border-gray-300 dark:border-gray-700" />

              <h4 className="font-medium text-lg dark:text-white">Submitted At</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(feedback.createdAt).toLocaleString()}
              </p>
            </div>
          </DialogContent>
        </Dialog>

      )}
    </>
  )
}

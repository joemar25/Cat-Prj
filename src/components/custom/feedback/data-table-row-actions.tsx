'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useUser } from '@/context/user-context'
import { Feedback, Permission } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
  const [isDeleting, setIsDeleting] = useState(false)
  const { permissions } = useUser()

  const canDelete = hasPermission(permissions, Permission.FEEDBACK_DELETE)
  const canViewDetails = hasPermission(permissions, Permission.FEEDBACK_READ)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()

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
              <DialogTitle>Feedback Details</DialogTitle>
              <DialogDescription>
                Detailed information about the feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Feedback</h4>
                <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
              </div>
              <div>
                <h4 className="font-medium">Submitted By</h4>
                <p className="text-sm text-muted-foreground">
                  {feedback.user ? feedback.user.name : 'Anonymous'}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  {feedback.user ? feedback.user.email : 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Submitted At</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
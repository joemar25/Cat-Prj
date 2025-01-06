'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Feedback } from '@prisma/client'
import { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'

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

type FeedbackRow = Feedback & {
  user: { name: string; email: string; image: string | null } | null
}

interface DataTableRowActionsProps {
  row: Row<FeedbackRow>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const feedback = row.original
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  const handleDelete = () => {
    toast.success(`Feedback "${feedback.feedback}" has been deleted successfully!`)
    // Add logic to delete feedback from the server/database
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
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
            onSelect={(e) => e.preventDefault()}
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Detailed information about the feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Feedback</span>
              <span className="col-span-3">{feedback.feedback}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Submitted By</span>
              <span className="col-span-3">
                {feedback.user ? feedback.user.name : 'Anonymous'}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Email</span>
              <span className="col-span-3">
                {feedback.user ? feedback.user.email : 'N/A'}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Submitted At</span>
              <span className="col-span-3">
                {new Date(feedback.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
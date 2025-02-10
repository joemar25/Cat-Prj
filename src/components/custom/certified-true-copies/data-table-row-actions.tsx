// src/components/custom/requests/data-table-row-actions.tsx
'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Row } from '@tanstack/react-table'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { ExtendedCertifiedCopy } from '@/types/certified-true-copy'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Add this type definition
type CertifiedCopyStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

interface DataTableRowActionsProps {
  row: Row<ExtendedCertifiedCopy>
  onUpdateRequest?: (updatedRequest: ExtendedCertifiedCopy) => void
}

export function DataTableRowActions({
  row,
  onUpdateRequest,
}: DataTableRowActionsProps) {
  const request = row.original
  const [isLoading, setIsLoading] = useState(false)
  const [showCompleteAlert, setShowCompleteAlert] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)

  // Update the function to use the correct type
  const handleStatusUpdate = async (status: CertifiedCopyStatus) => {
    setIsLoading(true)
    try {
      const updatedRequest = { ...request, status } as ExtendedCertifiedCopy
      onUpdateRequest?.(updatedRequest)
      toast.success(`Request status updated to ${status}`)
    } catch (error) {
      console.error('Error updating request status:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setShowCompleteAlert(false)
      setShowCancelAlert(false)
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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowCompleteAlert(true)}
            disabled={isLoading || request.status === 'COMPLETED'}
          >
            <Icons.check className="mr-2 h-4 w-4" />
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowCancelAlert(true)}
            disabled={isLoading || request.status === 'CANCELLED'}
          >
            <Icons.close className="mr-2 h-4 w-4" />
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Complete Request Alert Dialog */}
      <AlertDialog open={showCompleteAlert} onOpenChange={setShowCompleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this request as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate('COMPLETED')}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Complete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Request Alert Dialog */}
      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate('CANCELLED')}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
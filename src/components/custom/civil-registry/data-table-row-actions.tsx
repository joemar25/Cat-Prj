'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { hasPermission } from '@/types/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { Row } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { EditCivilRegistryFormDialog } from './actions/edit-civil-registry-form-dialog'

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
import { CivilRegistryFormWithRelations, deleteCivilRegistryForm } from '@/hooks/civil-registry-action'

interface DataTableRowActionsProps {
    row: Row<CivilRegistryFormWithRelations>
    onUpdateAction?: (updatedForm: CivilRegistryFormWithRelations) => void
}

export function DataTableRowActions({
    row,
    onUpdateAction,
}: DataTableRowActionsProps) {
    const { data: session } = useSession()
    const form = row.original
    const [isLoading, setIsLoading] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

    // Check permissions
    const canManageForms = hasPermission(
        session?.user?.permissions ?? [],
        'DOCUMENTS_MANAGE'
    )
    if (!canManageForms) return null

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const result = await deleteCivilRegistryForm(form.id)
            if (result.success) {
                toast.success(result.message)
                onUpdateAction?.(form) // Notify parent of the deleted form
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error deleting form:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = (updatedForm: CivilRegistryFormWithRelations) => {
        toast.success(`Form ${updatedForm.id} has been updated successfully!`)
        onUpdateAction?.(updatedForm) // Notify parent of the updated form data
        setEditDialogOpen(false) // Close the dialog
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <Icons.moreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[160px]'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setViewDetailsOpen(true)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                        <Icons.edit className='mr-2 h-4 w-4' />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={handleDelete}
                        disabled={isLoading}
                        className='text-destructive focus:text-destructive'
                    >
                        <Icons.trash className='mr-2 h-4 w-4' />
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Form Dialog */}
            <EditCivilRegistryFormDialog
                form={form}
                open={editDialogOpen}
                onOpenChangeAction={(open) => setEditDialogOpen(open)}
                onSave={handleSave}
            />

            {/* View Details Dialog */}
            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Form Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the civil registry form.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <span className='font-medium'>Form Type</span>
                            <span className='col-span-3'>{form.formType}</span>
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <span className='font-medium'>Prepared By</span>
                            <span className='col-span-3'>{form.preparedBy?.name || 'N/A'}</span>
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <span className='font-medium'>Verified By</span>
                            <span className='col-span-3'>{form.verifiedBy?.name || 'N/A'}</span>
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <span className='font-medium'>Created At</span>
                            <span className='col-span-3'>
                                {new Date(form.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
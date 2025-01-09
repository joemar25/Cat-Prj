// src/components/custom/civil-registry/actions/edit-civil-registry-form-dialog.tsx
'use client'

import { CivilRegistryFormWithRelations, updateCivilRegistryForm } from '@/hooks/civil-registry-action'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'

interface EditCivilRegistryFormDialogProps {
    form: CivilRegistryFormWithRelations
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onSave: (updatedForm: CivilRegistryFormWithRelations) => void
}

export function EditCivilRegistryFormDialog({
    form,
    open,
    onOpenChangeAction,
    onSave,
}: EditCivilRegistryFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const result = await updateCivilRegistryForm(form.id, {
                // Add your form update fields here
            })

            if (result.success && result.data) {
                onSave(result.data)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error('Error updating form:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Civil Registry Form</DialogTitle>
                </DialogHeader>
                {/* Add your form fields here */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChangeAction(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
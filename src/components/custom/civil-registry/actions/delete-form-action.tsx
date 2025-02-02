import { toast } from 'sonner'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseRegistryFormWithRelations, deleteBaseRegistryForm } from '@/hooks/civil-registry-action'

interface DeleteFormActionProps {
    form: BaseRegistryFormWithRelations
    onUpdateAction?: (updatedForm: BaseRegistryFormWithRelations) => void
}

export function useDeleteFormAction({ form, onUpdateAction }: DeleteFormActionProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            const result = await deleteBaseRegistryForm(form.id)
            if (result.success) {
                toast.success(result.message)
                onUpdateAction?.(form)
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

    return { handleDelete, isLoading }
}
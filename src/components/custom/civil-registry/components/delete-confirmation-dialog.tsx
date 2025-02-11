// src/components/custom/civil-registry/components/delete-confirmation-dialog.tsx
'use client'


import { useTranslation } from 'react-i18next'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onConfirmAction: () => void
    isLoading: boolean
}

export function DeleteConfirmationDialog({
    open,
    onOpenChangeAction,
    onConfirmAction,
    isLoading,
}: DeleteConfirmationDialogProps) {
    const { t } = useTranslation()

    return (
        <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t(
                            'This action cannot be undone. This will permanently delete the form.'
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirmAction}>
                        {isLoading ? t('Deleting...') : t('Delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

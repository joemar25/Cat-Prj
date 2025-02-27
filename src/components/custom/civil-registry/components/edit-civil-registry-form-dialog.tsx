'use client'

import { useTranslation } from 'react-i18next'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface EditCivilRegistryFormDialogProps {
    form: BaseRegistryFormWithRelations
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onSave: (updatedForm: BaseRegistryFormWithRelations) => void
}

export function EditCivilRegistryFormDialog({
    open,
    onOpenChangeAction,
}: EditCivilRegistryFormDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editForm.title')}</DialogTitle>
                </DialogHeader>
                {/* Add form editing components here */}
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { Permission } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckedState } from "@radix-ui/react-checkbox"
import { useState, useTransition, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface CreateRoleDialogProps {
    isOpen: boolean
    onOpenChangeAction: (open: boolean) => Promise<void>
    createRoleAction: (data: {
        name: string
        description: string
        permissions: Permission[]
    }) => Promise<void>
}

export function CreateRoleDialog({
    isOpen,
    onOpenChangeAction,
    createRoleAction
}: CreateRoleDialogProps) {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
    const [isPending, startTransition] = useTransition()

    // Dynamically group permissions by prefix
    const permissionGroups = useMemo(() => {
        const groups: Record<string, Permission[]> = {}
        Object.values(Permission).forEach((permission) => {
            const group = permission.split('_')[0]
            if (!groups[group]) {
                groups[group] = []
            }
            groups[group].push(permission)
        })
        return groups
    }, [])

    const handleCreateAction = () => {
        startTransition(async () => {
            try {
                await createRoleAction({
                    name,
                    description,
                    permissions: selectedPermissions,
                })

                // Reset form
                setName('')
                setDescription('')
                setSelectedPermissions([])

                // Close dialog
                await onOpenChangeAction(false)
            } catch (error) {
                console.error('Error creating role:', error)
                // Here you can add toast notification for error
            }
        })
    }

    const handleOpenChange = (open: boolean) => {
        startTransition(async () => {
            await onOpenChangeAction(open)
        })
    }

    const togglePermission = (permission: Permission, checked: CheckedState) => {
        if (checked) {
            setSelectedPermissions(prev => [...prev, permission])
        } else {
            setSelectedPermissions(prev => prev.filter(p => p !== permission))
        }
    }

    const toggleGroup = (permissions: Permission[], checked: CheckedState) => {
        if (checked) {
            setSelectedPermissions(prev => {
                const newPermissions = new Set([...prev, ...permissions])
                return Array.from(newPermissions)
            })
        } else {
            setSelectedPermissions(prev =>
                prev.filter(p => !permissions.includes(p))
            )
        }
    }

    const getGroupState = (permissions: Permission[]): CheckedState => {
        const selectedCount = permissions.filter(p => selectedPermissions.includes(p)).length
        if (selectedCount === 0) return false
        if (selectedCount === permissions.length) return true
        return "indeterminate"
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('Create Role')}</DialogTitle>
                    <DialogDescription>
                        {t('Enter the details for the new role.')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">{t('Name')}</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('Enter role name')}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">{t('Description')}</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('Enter role description')}
                        />
                    </div>

                    <div>
                        <Label>{t('Permissions')}</Label>
                        <div className="h-[400px] overflow-y-auto space-y-4 border rounded-md p-4">
                            {Object.entries(permissionGroups).map(([group, permissions]) => (
                                <div key={group} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`group-${group}`}
                                            checked={getGroupState(permissions)}
                                            onCheckedChange={(checked) =>
                                                toggleGroup(permissions, checked)
                                            }
                                        />
                                        <Label
                                            htmlFor={`group-${group}`}
                                            className="text-sm font-semibold"
                                        >
                                            {t(group)}
                                        </Label>
                                    </div>
                                    <div className="ml-6 grid grid-cols-2 gap-2">
                                        {permissions.map((permission) => (
                                            <div key={permission} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={permission}
                                                    checked={selectedPermissions.includes(permission)}
                                                    onCheckedChange={(checked) =>
                                                        togglePermission(permission, checked)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={permission}
                                                    className="text-sm"
                                                >
                                                    {permission.split('_').slice(1).join('_')}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button
                            onClick={handleCreateAction}
                            disabled={isPending || !name.trim()}
                        >
                            {isPending ? t('Creating...') : t('Create')}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
'use client'

import { toast } from 'sonner'
import { Permission } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { CheckedState } from '@radix-ui/react-checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useTransition, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// Adjusted props to allow description to be null and permissions optional.
interface UpdateRoleDialogProps {
  isOpen: boolean
  role: {
    id: string
    name: string
    description: string | null
    permissions?: Permission[]
  }
  onOpenChangeAction: (open: boolean) => Promise<void>
  updateRoleAction: (
    id: string,
    data: { name: string; description: string; permissions: Permission[] }
  ) => Promise<{ error?: string; data?: any } | void>
}

export function UpdateRoleDialog({
  isOpen,
  role,
  onOpenChangeAction,
  updateRoleAction,
}: UpdateRoleDialogProps) {
  const { t } = useTranslation()
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description ?? '')
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    role.permissions ?? []
  )
  const [isPending, startTransition] = useTransition()

  // Update local state when the passed-in role changes
  useEffect(() => {
    setName(role.name)
    setDescription(role.description ?? '')
    setSelectedPermissions(role.permissions ?? [])
  }, [role])

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

  const handleUpdateAction = () => {
    startTransition(async () => {
      try {
        const requestData = { name, description, permissions: selectedPermissions }
        console.log('Updating role with data:', requestData)
        const result = await updateRoleAction(role.id, requestData)

        if (result && typeof result === 'object' && 'error' in result && result.error) {
          const detailedError = t(`Failed to update role: ${result.error}`)
          console.error('Error updating role:', result.error)
          toast.error(detailedError)
          return
        }

        toast.success(t('Role updated successfully'))
        // Close dialog after successful update
        await onOpenChangeAction(false)
      } catch (error: any) {
        console.error('Error updating role:', error)
        const detailedError = error?.message || t('Unknown error occurred')
        toast.error(t(`Failed to update role: ${detailedError}`))
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
      setSelectedPermissions((prev) => [...prev, permission])
    } else {
      setSelectedPermissions((prev) => prev.filter((p) => p !== permission))
    }
  }

  const toggleGroup = (permissions: Permission[], checked: CheckedState) => {
    if (checked) {
      setSelectedPermissions((prev) => {
        const newPermissions = new Set([...prev, ...permissions])
        return Array.from(newPermissions)
      })
    } else {
      setSelectedPermissions((prev) => prev.filter((p) => !permissions.includes(p)))
    }
  }

  const getGroupState = (permissions: Permission[]): CheckedState => {
    const selectedCount = permissions.filter((p) => selectedPermissions.includes(p)).length
    if (selectedCount === 0) return false
    if (selectedCount === permissions.length) return true
    return 'indeterminate'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {t('Update Role')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('Update the details for the role.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="name" className="block mb-1">
              {t('Name')}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Enter role name')}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="description" className="block mb-1">
              {t('Description')}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('Enter role description')}
              className="w-full"
              rows={4}
            />
          </div>

          <div>
            <Label className="block mb-2">{t('Permissions')}</Label>
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-4 p-4">
                {Object.entries(permissionGroups).map(([group, permissions]) => (
                  <div key={group} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-${group}`}
                        checked={getGroupState(permissions)}
                        onCheckedChange={(checked) => toggleGroup(permissions, checked)}
                      />
                      <Label htmlFor={`group-${group}`} className="text-sm font-semibold">
                        {t(group)}
                      </Label>
                    </div>
                    <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={selectedPermissions.includes(permission)}
                            onCheckedChange={(checked) => togglePermission(permission, checked)}
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleUpdateAction} disabled={isPending || !name.trim()}>
              {isPending ? t('Updating...') : t('Update')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

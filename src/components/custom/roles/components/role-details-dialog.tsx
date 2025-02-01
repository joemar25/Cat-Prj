'use client'

import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Role } from '@prisma/client'
import { format } from 'date-fns'

interface RoleDetailsDialogProps {
    role: Role & {
        permissions: string[]
        users: { id: string; name: string; email: string }[]
    }
    onCloseAction?: () => void
}

export function RoleDetailsDialog({ role, onCloseAction }: RoleDetailsDialogProps) {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Role Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <div><strong>ID:</strong> {role.id}</div>
                <div><strong>Name:</strong> {role.name}</div>
                <div><strong>Description:</strong> {role.description || 'N/A'}</div>
                <div><strong>Created At:</strong> {format(new Date(role.createdAt), 'PPP')}</div>
                <div><strong>Updated At:</strong> {format(new Date(role.updatedAt), 'PPP')}</div>
                <div><strong>Permissions:</strong> {role.permissions.length > 0 ? role.permissions.join(', ') : 'None'}</div>
                <div><strong>Users:</strong> {role.users.length > 0 ? role.users.map(user => user.name).join(', ') : 'No users assigned'}</div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={onCloseAction}>Close</Button>
            </DialogFooter>
        </>
    )
}
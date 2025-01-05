'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { User } from '@prisma/client'
import { Loader2, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Row } from '@tanstack/react-table'
import { hasPermission } from '@/types/auth'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DataTableRowActionsProps {
    row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const user = row.original
    const [isLoading, setIsLoading] = useState(false)
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

    // Check permissions
    const canManageUsers = hasPermission(session?.user?.permissions ?? [], 'USERS_MANAGE')
    if (!canManageUsers) return null

    // Handlers
    const handleView = () => setViewDetailsOpen(true)
    const handleEdit = () => router.push(`/users/${user.id}/edit`)

    const handleDeactivate = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: false }),
            })

            if (!response.ok) {
                throw new Error('Failed to deactivate user')
            }

            toast.success('User deactivated successfully')
            router.refresh()
        } catch (error) {
            console.error('Error deactivating user:', error)
            toast.error('Failed to deactivate user')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* -- Dropdown Menu Trigger -- */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                {/* -- Dropdown Items -- */}
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleView}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        Edit
                    </DropdownMenuItem>

                    {/* Hide "Deactivate" if it's the current user (self) */}
                    {user.id !== session?.user?.id && (
                        <>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        Deactivate
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will deactivate the user account. The user will no
                                            longer be able to access the system. Are you sure?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeactivate}
                                            className="bg-destructive text-destructive-foreground"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Deactivating...
                                                </>
                                            ) : (
                                                'Deactivate'
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* -- User Details Dialog -- */}
            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            A summary of key user information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-semibold">Name</div>
                            <div className="col-span-3">{user.name}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-semibold">Email</div>
                            <div className="col-span-3">{user.email}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-semibold">Role</div>
                            <div className="col-span-3">{user.role}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-semibold">Status</div>
                            <div className="col-span-3">
                                {user.emailVerified ? 'Verified' : 'Unverified'}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
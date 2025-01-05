'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Row } from '@tanstack/react-table'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { hasPermission } from '@/types/auth'

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

    const canManageUsers = hasPermission(session?.user?.permissions ?? [], 'USERS_MANAGE')

    if (!canManageUsers) return null

    const handleView = () => {
        setViewDetailsOpen(true)
    }

    const handleEdit = () => {
        router.push(`/users/${user.id}/edit`)
    }

    const handleDeactivate = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    active: false
                })
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <Icons.horizontalThreeDots className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={handleView}>
                        <Icons.view className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                        <Icons.edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    {user.id !== session?.user?.id && (
                        <>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Icons.trash className="mr-2 h-4 w-4" />
                                        Deactivate
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will deactivate the user account. The user will no longer be able to access the system.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeactivate}
                                            className="bg-red-600 focus:bg-red-600"
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

            <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Name</div>
                            <div className="col-span-3">{user.name}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Email</div>
                            <div className="col-span-3">{user.email}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Role</div>
                            <div className="col-span-3">{user.role}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Status</div>
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
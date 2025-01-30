'use client'

import { Session } from "next-auth"
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Permission } from '@prisma/client'
import { DataTableRowActions } from './data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserWithRoleAndProfile } from '@/types/user'

const roleVariants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    'Super Admin': { label: "Super Admin", variant: "destructive" },
    'Admin': { label: "Administrator", variant: "destructive" },
    'Staff': { label: "Staff", variant: "secondary" },
    'User': { label: "User", variant: "default" }
}

interface UserCellProps {
    row: Row<UserWithRoleAndProfile>
}

const UserCell = ({ row }: UserCellProps) => {
    const { t } = useTranslation()
    const user = row.original
    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()

    return (
        <div className="flex items-center gap-3 py-1">
            <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ''} alt={user.name} />
                <AvatarFallback className="font-medium">
                    {initials || 'U'}
                </AvatarFallback>
            </Avatar>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex flex-col">
                            <div className="font-medium">{user.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Icons.user className="h-3 w-3 text-blue-500" />
                                <span className="text-sm text-muted-foreground">
                                    @{user.username || t('no_username')}
                                </span>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                        <div className="space-y-1.5">
                            <p>{user.name}</p>
                            <p>{t('username')}: @{user.username || t('no_username')}</p>
                            <p>{t('id')}: {user.id}</p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

interface EmailCellProps {
    email: string
}

const EmailCell = ({ email }: EmailCellProps) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-1.5">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1.5">
                        <Icons.mail className="w-3 h-3 text-violet-500" />
                        <span className="text-sm truncate max-w-[150px]">
                            {email}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{email}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export const createColumns = (
    session: Session | null,
    onUpdateUser?: (user: UserWithRoleAndProfile) => void
): ColumnDef<UserWithRoleAndProfile>[] => {
    const { t } = useTranslation()

    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('dataTable.user')} />
            ),
            cell: ({ row }) => <UserCell row={row} />,
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('dataTable.contact')} />
            ),
            cell: ({ row }) => <EmailCell email={row.getValue('email')} />,
        },
        {
            id: 'role',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('dataTable.role')} />
            ),
            cell: ({ row }) => {
                const roles = row.original.roles
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.map(({ role }) => {
                            const roleInfo = roleVariants[role.name]
                            return (
                                <Badge key={role.id} variant={roleInfo.variant} className="font-medium">
                                    {roleInfo.label}
                                </Badge>
                            )
                        })}
                    </div>
                )
            },
        },
        {
            id: "permissions",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t("dataTable.permissions")} />
            ),
            cell: ({ row }) => {
                // Collect all unique permissions from all roles
                const permissions = new Set<Permission>()
                row.original.roles.forEach(({ role }) => {
                    role.permissions.forEach(({ permission }) => {
                        permissions.add(permission)
                    })
                })
                const permissionArray = Array.from(permissions)

                return (
                    <div className="flex flex-wrap gap-1">
                        {permissionArray.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant={"outline"} className="text-xs">
                                {permission.replace("_", " ")}
                            </Badge>
                        ))}

                        {permissionArray.length > 2 && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Badge variant={"outline"} className="text-xs cursor-pointer">
                                        {t("dataTable.morePermissions", { count: permissionArray.length - 2 })}
                                    </Badge>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3">
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-medium">{t("dataTable.allPermissions")}: </h4>
                                        {permissionArray.map((permission) => (
                                            <p key={permission} className="text-xs">
                                                {permission.replace("_", " ")}
                                            </p>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: 'emailVerified',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('dataTable.status')} />
            ),
            cell: ({ row }) => {
                const isVerified = row.getValue('emailVerified') as boolean
                return (
                    <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        <span className={`text-sm ${isVerified ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                            {isVerified ? t('dataTable.verified') : t('dataTable.unverified')}
                        </span>
                    </div>
                )
            },
            filterFn: (row, id, value: string[]) => {
                const rowValue = row.getValue(id) as boolean
                const stringValue = String(rowValue)
                return value.includes(stringValue)
            },
        },
        {
            id: 'dates',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={t('dataTable.activity')} />
            ),
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex flex-col gap-1.5 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Icons.calendar className="w-3 h-3 text-orange-500" />
                            <span className="text-muted-foreground">
                                {t('dataTable.created')} {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Icons.refresh className="w-3 h-3 text-blue-500" />
                            <span className="text-muted-foreground">
                                {t('dataTable.updated')} {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                if (session?.user?.email === row.original.email) {
                    return null
                }
                return <DataTableRowActions row={row} onUpdateUser={onUpdateUser} />
            },
        },
    ]
}
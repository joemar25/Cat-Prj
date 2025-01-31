'use client'

import { format } from 'date-fns'
import { Role, Permission } from '@prisma/client'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Shield } from 'lucide-react'
import { t } from 'i18next'


type RoleRow = Role & {
    permissions: Permission[]
    users: { id: string; name: string; email: string }[]
}

export const columns: ColumnDef<RoleRow>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Description')} />
        },
        cell: ({ row }) => {
            const description = row.getValue('description') as string
            return <div className="text-sm text-muted-foreground">{description || 'No description'}</div>
        },
    },
    {
        accessorKey: 'permissions',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Permissions')} />
        },
        cell: ({ row }) => {
            const permissions = new Set(row.getValue('permissions') as Permission[])
            return (
                <Popover>
                    <PopoverTrigger>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                            <Shield className="w-3 h-3 mr-1" />
                            {permissions.size} {t('Permissions')}
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pb-2 border-b">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                <h4 className="font-medium">{t('All Permissions')}</h4>
                            </div>
                            <div className="space-y-1">
                                {Array.from(permissions).map((permission) => (
                                    <div
                                        key={permission}
                                        className="text-sm px-2 py-1 rounded-md bg-secondary/50"
                                    >
                                        {permission.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Created At')} />
        },
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as Date
            return (
                <div className="text-sm text-muted-foreground">
                    {format(new Date(createdAt), 'PPP p')}
                </div>
            )
        },
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Last Updated')} />
        },
        cell: ({ row }) => {
            const updatedAt = row.getValue('updatedAt') as Date
            return (
                <div className="text-sm text-muted-foreground">
                    {t('Updated')}: {format(new Date(updatedAt), 'PPP p')}
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Actions')} />
        },
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]

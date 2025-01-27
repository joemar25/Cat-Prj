'use client'

import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Feedback } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'

type FeedbackRow = Feedback & {
    user: { name: string; email: string; image: string | null } | null
}

export const columns: ColumnDef<FeedbackRow>[] = [
    {
        accessorKey: 'user',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('User')} />
        },
        cell: ({ row }) => {
            const user = row.getValue('user') as FeedbackRow['user']
            const initials = user ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'A'

            return (
                <div className="flex items-center gap-3 py-1">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.image || ''} alt={user?.name || 'Anonymous'} />
                        <AvatarFallback className="font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="font-medium">{user ? user.name : 'Anonymous'}</div>
                        {user && <div className="text-sm text-muted-foreground">{user.email}</div>}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'feedback',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Feedback')} />
        },
        cell: ({ row }) => <div className="text-sm">{row.getValue('feedback') as string}</div>,
    },
    {
        accessorKey: 'submittedBy',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Submitted By')} />
        },
        cell: ({ row }) => {
            const { t } = useTranslation()
            return row.getValue('submittedBy') ? t('Known User') : t('Anonymous') // Fix here
        },
        filterFn: (row, id, value: string[]) => {
            const hasSubmitter = Boolean(row.getValue(id))
            return value.includes(String(hasSubmitter))
        }
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            const { t } = useTranslation()
            return <DataTableColumnHeader column={column} title={t('Submitted At')} />
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
            const { t } = useTranslation()
            const updatedAt = row.getValue('updatedAt') as Date  // Keep the field name 'updatedAt' directly
            return (
                <div className="text-sm text-muted-foreground">
                    {t('Updated')}: {format(new Date(updatedAt), 'PPP p')}  {/* Translate the label "Updated" */}
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

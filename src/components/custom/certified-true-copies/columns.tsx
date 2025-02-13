// src/components/custom/certified-true-copies/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ExtendedCertifiedCopy } from '@/types/certified-true-copy'

const statusVariants: Record<string, { label: string, variant: 'secondary' | 'default' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'Pending', variant: 'secondary' },
    PROCESSING: { label: 'Processing', variant: 'default' },
    COMPLETED: { label: 'Completed', variant: 'default' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive' },
}

export const createColumns = (
    onUpdateRequest?: (request: ExtendedCertifiedCopy) => void
): ColumnDef<ExtendedCertifiedCopy>[] => [
        {
            accessorKey: 'requesterName',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Requester" />
            ),
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('requesterName')}</div>
            ),
        },
        {
            accessorKey: 'purpose',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Purpose" />
            ),
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('purpose')}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Requested At" />
            ),
            cell: ({ row }) => (
                <div className="text-sm">
                    {formatDistanceToNow(new Date(row.getValue('createdAt')), {
                        addSuffix: true,
                    })}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.getValue('status') as keyof typeof statusVariants
                const statusInfo = statusVariants[status] || {
                    label: 'Unknown',
                    variant: 'default',
                }
                return (
                    <Badge variant={statusInfo.variant} className="font-medium">
                        {statusInfo.label}
                    </Badge>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: 'attachment',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Attachment" />
            ),
            cell: ({ row }) => {
                const certifiedCopy = row.original
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5">
                                    <Icons.file className="h-4 w-4 text-chart-1" />
                                    <span className="text-sm truncate max-w-[150px]">
                                        {certifiedCopy.attachment?.fileName ?? 'No attachment'}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{certifiedCopy.attachment?.fileName ?? 'No attachment'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            },
        },
        {
            id: 'actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DataTableRowActions
                        row={row}
                        onUpdateRequest={onUpdateRequest}
                    />
                )
            },
        },
    ]

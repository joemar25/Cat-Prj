// src/components/custom/civil-registry/columns.tsx
'use client'

import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { CivilRegistryForm, FormType, User } from '@prisma/client'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableColumnHeader } from '@/components/custom/table/data-table-column-header'

// Define the type for the form with included relations
type CivilRegistryFormWithRelations = CivilRegistryForm & {
    preparedBy: User | null
    verifiedBy: User | null
}

const formTypeVariants: Record<FormType, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    MARRIAGE: { label: "Marriage", variant: "destructive" },
    BIRTH: { label: "Birth", variant: "secondary" },
    DEATH: { label: "Death", variant: "default" }
}

export const columns: ColumnDef<CivilRegistryFormWithRelations>[] = [
    {
        accessorKey: 'formType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Form Type" />
        ),
        cell: ({ row }) => {
            const formType = row.getValue('formType') as FormType
            const formTypeInfo = formTypeVariants[formType]
            return (
                <Badge variant={formTypeInfo.variant} className="font-medium">
                    {formTypeInfo.label}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'preparedBy',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Prepared By" />
        ),
        cell: ({ row }) => {
            const preparedBy = row.original.preparedBy?.name || 'N/A'
            return <span>{preparedBy}</span>
        },
    },
    {
        accessorKey: 'verifiedBy',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Verified By" />
        ),
        cell: ({ row }) => {
            const verifiedBy = row.original.verifiedBy?.name || 'N/A'
            return <span>{verifiedBy}</span>
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt') as Date
            return <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
        },
    },
    {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
            return <DataTableRowActions row={row} />
        },
    },
]
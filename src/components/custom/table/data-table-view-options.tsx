'use client'

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

const defaultVisibleColumns = [
    'formType',
    'registryDetails',
    'details',
    'preparedBy',
    'verifiedBy',
    'registeredBy',
    'createdAt',
]

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const { t } = useTranslation()

    // Set default visible columns on component mount
    useEffect(() => {
        table.getAllColumns().forEach((column) => {
            if (typeof column.accessorFn !== 'undefined' && column.getCanHide()) {
                column.toggleVisibility(defaultVisibleColumns.includes(column.id))
            }
        })
    }, [table])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-4"
                >
                    <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                    {t('View')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>{t('Toggle columns')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== 'undefined' && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {t(column.id)}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
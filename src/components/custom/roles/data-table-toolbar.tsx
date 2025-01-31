'use client'

import { useCallback, useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Role, Permission } from '@prisma/client'
import { Cross2Icon } from '@radix-ui/react-icons'
import { CreateRoleDialog } from './components/create-role-dialog'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'

interface DataTableToolbarProps<TData extends Role> {
    table: Table<TData>
}

const permissionOptions = [
    { label: 'Create', value: Permission.ROLE_CREATE },
    { label: 'Read', value: Permission.ROLE_READ },
    { label: 'Update', value: Permission.ROLE_UPDATE },
    { label: 'Delete', value: Permission.ROLE_DELETE },
    { label: 'Assign', value: Permission.ROLE_ASSIGN },
]

export function DataTableToolbar<TData extends Role>({ table }: DataTableToolbarProps<TData>) {
    const { t } = useTranslation()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const isFiltered = table.getState().columnFilters.length > 0
    const nameColumn = table.getColumn('name')
    const permissionsColumn = table.getColumn('permissions')

    const handleSearch = useCallback((value: string) => {
        if (nameColumn) {
            nameColumn.setFilterValue(value)
        }
    }, [nameColumn])

    const handleResetFilters = useCallback(() => {
        table.resetColumnFilters()
    }, [table])

    const handleExport = useCallback(() => {
        const filteredData = table.getFilteredRowModel().rows.map((row) => row.original)
        const csvContent = [
            Object.keys(filteredData[0] || {}).join(','),
            ...filteredData.map((row) =>
                Object.values(row)
                    .map((value) => (value ? `"${value}"` : ''))
                    .join(',')
            ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'roles_export.csv'
        link.click()
    }, [table])

    const handleCreateRole = useCallback(async (data: any) => {
        try {
            const response = await fetch('/api/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error('Failed to create role')
        } catch (error) {
            console.error('Error:', error)
        }
    }, [])

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
                <div className="relative">
                    <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder={t('Search roles...')}
                        value={(nameColumn?.getFilterValue() as string) ?? ''}
                        onChange={(event) => handleSearch(event.target.value)}
                        className="h-10 w-[200px] lg:w-[300px] pl-10"
                    />
                </div>

                {permissionsColumn && (
                    <DataTableFacetedFilter
                        column={permissionsColumn}
                        title={t('Permissions')}
                        options={permissionOptions}
                    />
                )}

                {isFiltered && (
                    <Button variant="ghost" onClick={handleResetFilters} className="h-10 px-3">
                        {t('Reset')}
                        <Cross2Icon className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="default" className="h-10" onClick={() => setIsCreateDialogOpen(true)}>
                    <Icons.plus className="mr-2 h-4 w-4" />
                    {t('Create Role')}
                </Button>

                <Button variant="outline" className="h-10" onClick={handleExport}>
                    <Icons.download className="mr-2 h-4 w-4" />
                    {t('Export')}
                </Button>

                <DataTableViewOptions table={table} />
            </div>

            <CreateRoleDialog
                isOpen={isCreateDialogOpen}
                onOpenChangeAction={async (open) => setIsCreateDialogOpen(open)}
                createRoleAction={handleCreateRole}
            />
        </div>
    )
}

'use client'

import { useCallback } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { User, UserRole } from '@prisma/client'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'
import { AddUserDialog } from './actions/add-user-dialog'

interface DataTableToolbarProps<TData extends User> {
    table: Table<TData>
}

const userRoles = [
    { label: "Administrator", value: UserRole.ADMIN },
    { label: "Staff", value: UserRole.STAFF },
    { label: "User", value: UserRole.USER }
]

const verificationStatus = [
    { label: "Verified", value: "true" },
    { label: "Unverified", value: "false" }
]

export function DataTableToolbar<TData extends User>({
    table
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const nameColumn = table.getColumn('name')
    const roleColumn = table.getColumn('role')
    const statusColumn = table.getColumn('emailVerified')

    const handleSearch = useCallback((value: string) => {
        nameColumn?.setFilterValue(value)
    }, [nameColumn])

    const handleExport = () => {
        console.log('Export functionality to be implemented')
    }

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center space-x-4'>
                <div className='relative'>
                    <Icons.search className='absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <Input
                        placeholder='Search users...'
                        value={(nameColumn?.getFilterValue() as string) ?? ''}
                        onChange={(event) => handleSearch(event.target.value)}
                        className='h-10 w-[200px] lg:w-[300px] pl-10'
                    />
                </div>

                {roleColumn && (
                    <DataTableFacetedFilter
                        column={roleColumn}
                        title='Role'
                        options={userRoles.map((role) => ({
                            label: role.label,
                            value: role.value,
                            icon: role.value === UserRole.ADMIN ? Icons.shield :
                                role.value === UserRole.STAFF ? Icons.user : Icons.userCog
                        }))}
                    />
                )}

                {statusColumn && (
                    <DataTableFacetedFilter
                        column={statusColumn}
                        title='Status'
                        options={verificationStatus}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant='ghost'
                        onClick={() => table.resetColumnFilters()}
                        className='h-10 px-3'
                    >
                        Reset
                        <Cross2Icon className='ml-2 h-5 w-5' />
                    </Button>
                )}
            </div>
            <div className='flex items-center space-x-4'>
                <Button
                    variant="outline"
                    className="h-10"
                    onClick={handleExport}
                >
                    <Icons.download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <AddUserDialog onSuccess={() => {
                    table.resetColumnFilters()
                    table.resetSorting()
                }} />
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
// src/components/custom/users/data-table.tsx
'use client'


import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import type { User } from '@prisma/client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from '@/components/custom/table/data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import React from 'react'

// Define possible value types that can appear in the columns
type UserValue = string | number | boolean | Date | null | undefined

// Define strict types for the DataTable props
interface DataTableProps<TData extends User> {
    columns: ColumnDef<TData, UserValue>[]
    data: TData[]
    searchKey?: string
    selection?: boolean
    role?: string
}

// Update the DataTable component to use the constrained generic type
export function DataTable<TData extends User>({
    columns,
    data,
    selection = true,
    role,
}: DataTableProps<TData>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: selection,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className='space-y-4'>
            <DataTableToolbar table={table} role={role} />
            <div className='rounded-md border bg-popover shadow-md'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    <Card className="mx-auto max-w-md">
                                        <CardContent className="flex flex-col items-center space-y-4 p-6">
                                            <div className="rounded-full bg-muted p-3">
                                                <Icons.search className="h-6 w-6" />
                                            </div>
                                            <p className="text-lg font-semibold">No results found</p>
                                            <p className="text-sm text-muted-foreground">
                                                {columnFilters.length > 0
                                                    ? 'Try adjusting your filters or search terms'
                                                    : 'No users have been added yet'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} showSelected={selection} />
        </div>
    )
}
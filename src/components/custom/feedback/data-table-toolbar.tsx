'use client'

import { useCallback } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/ui/icons'
import { Feedback } from '@prisma/client'
import { DataTableViewOptions } from '@/components/custom/table/data-table-view-options'
import { DataTableFacetedFilter } from '@/components/custom/table/data-table-faceted-filter'

interface DataTableToolbarProps<TData extends Feedback> {
    table: Table<TData>
}

const submittedByOptions = [
    { label: 'Anonymous', value: 'false' },
    { label: 'Known Users', value: 'true' },
]

export function DataTableToolbar<TData extends Feedback>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const feedbackColumn = table.getColumn('feedback')
    const submittedByColumn = table.getColumn('submittedBy')

    const handleSearch = useCallback(
        (value: string) => {
            if (feedbackColumn) {
                feedbackColumn.setFilterValue(value)
            }
        },
        [feedbackColumn]
    )

    const handleResetFilters = useCallback(() => {
        table.resetColumnFilters()
    }, [table])

    const handleExport = () => {
        const filteredData = table.getFilteredRowModel().rows.map((row) => row.original)
        const csvContent = [
            Object.keys(filteredData[0] || {}).join(','),
            ...filteredData.map((row) =>
                Object.values(row)
                    .map((value) => (value ? `"${value}"` : ''))
                    .join(',')
            ),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csvcharset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'feedback_export.csv'
        link.click()
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
                <div className="relative">
                    <Icons.search className="absolute h-5 w-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search feedback..."
                        value={(feedbackColumn?.getFilterValue() as string) ?? ''}
                        onChange={(event) => handleSearch(event.target.value)}
                        className="h-10 w-[200px] lg:w-[300px] pl-10"
                    />
                </div>

                {submittedByColumn && (
                    <DataTableFacetedFilter
                        column={submittedByColumn}
                        title="Submitted By"
                        options={submittedByOptions}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleResetFilters}
                        className="h-10 px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    className="h-10"
                    onClick={handleExport}
                >
                    <Icons.download className="mr-2 h-4 w-4" />
                    Export
                </Button>

                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
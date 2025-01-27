import { useTranslation } from 'react-i18next'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    showSelected?: boolean
}

export function DataTablePagination<TData>({
    table,
    showSelected = true,
}: DataTablePaginationProps<TData>) {
    const { t } = useTranslation() // Use i18n hook

    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
    const totalRowCount = table.getFilteredRowModel().rows.length

    return (
        <div className='flex items-center justify-between px-2'>
            <div className='flex-1 text-sm text-muted-foreground'>
                {showSelected && (
                    <span>
                        {selectedRowCount > 0
                            ? t('datatable.selected_rows', {
                                  selected: selectedRowCount,
                                  total: totalRowCount,
                              })
                            : t('datatable.no_rows_selected')}
                    </span>
                )}
            </div>
            <div className='flex items-center space-x-6 lg:space-x-8'>
                <div className='flex items-center space-x-2'>
                    <p className='text-sm font-medium'>{t('datatable.rows_per_page')}</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                    {t('datatable.page_info', {
                        current: table.getState().pagination.pageIndex + 1,
                        total: table.getPageCount(),
                    })}
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant={'outline'}
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className='sr-only'>{t('datatable.go_to_first_page')}</span>
                        <DoubleArrowLeftIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant={'outline'}
                        className='h-8 w-8 p-0'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className='sr-only'>{t('datatable.go_to_previous_page')}</span>
                        <ChevronLeftIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant={'outline'}
                        className='h-8 w-8 p-0'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className='sr-only'>{t('datatable.go_to_next_page')}</span>
                        <ChevronRightIcon className='h-4 w-4' />
                    </Button>
                    <Button
                        variant={'outline'}
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className='sr-only'>{t('datatable.go_to_last_page')}</span>
                        <DoubleArrowRightIcon className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

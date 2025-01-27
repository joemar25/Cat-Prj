// src/components/custom/reports/component/data-table.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps<T> {
    title: string
    data: T[]
    tableHeaders: string[]
    renderTableRowAction: (entry: T) => React.ReactNode
}

export const DataTable = <T,>({ title, data, tableHeaders, renderTableRowAction }: DataTableProps<T>) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title} Data</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {tableHeaders.map((header) => (
                                <TableHead key={header}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((entry, index) => (
                            <TableRow key={index}>
                                {renderTableRowAction(entry)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
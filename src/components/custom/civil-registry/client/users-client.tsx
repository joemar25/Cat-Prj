// src/app/(dashboard)/civil-registry/civil-registry-client.tsx
'use client'

import useSWR from 'swr'
import { type FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { CivilRegistryDataTableClient } from './users-table-client'

interface CivilRegistryResponse {
    forms: BaseRegistryFormWithRelations[]
}

const fetcher = async (url: string): Promise<BaseRegistryFormWithRelations[]> => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Error fetching civil registry forms: ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : data.forms ?? []
}

export const CivilRegistryTableSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Loading Civil Registry Forms</CardTitle>
                <CardDescription>
                    Please wait while we fetch the civil registry forms...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const CivilRegistryClientPage: FC = () => {
    const { data: forms, error, isLoading } = useSWR<BaseRegistryFormWithRelations[]>(
        '/api/civil-registry',
        fetcher,
        {
            refreshInterval: 5000,
            fallbackData: [],
            revalidateOnFocus: false,
        }
    )

    if (error instanceof Error) {
        return (
            <Card className="p-6">
                <CardTitle className="text-red-600">Error</CardTitle>
                <CardDescription>
                    Failed to load civil registry forms: {error.message}
                </CardDescription>
            </Card>
        )
    }

    if (isLoading) {
        return <CivilRegistryTableSkeleton />
    }

    return <CivilRegistryDataTableClient forms={forms ?? []} />
}

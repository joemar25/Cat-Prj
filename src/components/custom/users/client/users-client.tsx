// src/app/(dashboard)/users/users-client.tsx
'use client'

import useSWR from 'swr'

import { type FC } from 'react'
import type { UserWithRoleAndProfile } from '@/types/user'

import { Skeleton } from '@/components/ui/skeleton'
import { UsersTableClient } from '@/components/custom/users/client/users-table-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UsersResponse {
    users: UserWithRoleAndProfile[]
}

const fetcher = async (url: string): Promise<UserWithRoleAndProfile[]> => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error(`Error fetching users: ${res.statusText}`)
    }
    const data = (await res.json()) as UsersResponse
    return data.users ?? []
}

export const UsersTableSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Loading Users</CardTitle>
                <CardDescription>Please wait while we fetch the user data...</CardDescription>
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

export const UsersClientPage: FC = () => {
    const { data: users, error, isLoading } = useSWR<UserWithRoleAndProfile[]>(
        '/api/users',
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
                <CardDescription>Failed to load users: {error.message}</CardDescription>
            </Card>
        )
    }

    if (isLoading) {
        return <UsersTableSkeleton />
    }

    return <UsersTableClient users={users ?? []} />
}
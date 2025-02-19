// src/components/custom/users/users-table-client.tsx
'use client'

import type { UserWithRoleAndProfile } from '@/types/user'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/custom/users/data-table'
import { createColumns } from '@/components/custom/users/columns'

interface UsersTableClientProps {
    users: UserWithRoleAndProfile[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<UserWithRoleAndProfile[]>([])

    useEffect(() => {
        setUsers(initialUsers)
    }, [initialUsers])

    if (status === 'loading') {
        return <div>Loading session...</div>
    }

    const handleUserUpdate = (updatedUser: UserWithRoleAndProfile) => {
        setUsers(prev =>
            prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
        )
    }

    const handleUserDelete = (deletedUserId: string) => {
        setUsers(prev => prev.filter(u => u.id !== deletedUserId))
    }

    const columns = createColumns(session, handleUserUpdate, handleUserDelete)

    return <DataTable data={users} columns={columns} selection={false} />
}
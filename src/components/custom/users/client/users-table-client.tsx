'use client'

import type { UserWithRoleAndProfile } from '@/types/user'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DataTable } from '@/components/custom/users/data-table'
import { useCreateColumns } from '@/components/custom/users/columns'

interface UsersTableClientProps {
    users: UserWithRoleAndProfile[]
    role?: string
}

export function UsersTableClient({ users: initialUsers, role }: UsersTableClientProps) {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState<UserWithRoleAndProfile[]>([])

    useEffect(() => {
        setUsers(initialUsers)
    }, [initialUsers])

    const handleUserUpdate = (updatedUser: UserWithRoleAndProfile) => {
        setUsers(prev =>
            prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
        )
    }

    const handleUserDelete = (deletedUserId: string) => {
        setUsers(prev => prev.filter(u => u.id !== deletedUserId))
    }

    const columns = useCreateColumns(session, handleUserUpdate, handleUserDelete)

    if (status === 'loading') {
        return <div>Loading session...</div>
    }

    return <DataTable data={users} columns={columns} selection={false} role={role} />
}
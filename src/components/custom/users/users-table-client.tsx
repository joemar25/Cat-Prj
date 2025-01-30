'use client'

import { useState } from 'react'
import { DataTable } from '@/components/custom/users/data-table'
import { createColumns } from '@/components/custom/users/columns'
import { useSession } from 'next-auth/react'
import { UserWithRoleAndProfile } from '@/types/user'

interface UsersTableClientProps {
    users: UserWithRoleAndProfile[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
    const { data: session } = useSession()
    const [users, setUsers] = useState<UserWithRoleAndProfile[]>(initialUsers)

    const handleUserUpdate = (updatedUser: UserWithRoleAndProfile) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        )
    }

    const columns = createColumns(session ?? null, handleUserUpdate)

    if (!columns || columns.length === 0) return <p className="text-center text-red-500">Error loading table columns</p>

    return <DataTable data={users} columns={columns} selection={false} />
}

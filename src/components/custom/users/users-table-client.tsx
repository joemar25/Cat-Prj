// src/components/custom/users/users-table-client.tsx
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

    const columns = createColumns(session, handleUserUpdate)

    return <DataTable data={users} columns={columns} selection={false} />
}
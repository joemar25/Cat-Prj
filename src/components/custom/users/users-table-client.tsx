// src/components/custom/users/users-table-client.tsx
'use client'

import { useState } from 'react'
import { DataTable } from '@/components/custom/users/data-table'
import { createColumns } from '@/components/custom/users/columns'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'

interface UsersTableClientProps {
    users: User[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
    const { data: session } = useSession()
    const [users, setUsers] = useState<User[]>(initialUsers)

    const handleUserUpdate = (updatedUser: User) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        )
    }

    const columns = createColumns(session, handleUserUpdate)

    return <DataTable data={users} columns={columns} selection={false} />
}
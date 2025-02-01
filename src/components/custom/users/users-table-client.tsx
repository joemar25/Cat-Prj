'use client'

import { useState } from 'react'
import { DataTable } from '@/components/custom/users/data-table'
import { createColumns } from '@/components/custom/users/columns'
import { UserWithRoleAndProfile } from '@/types/user'
import { useSession } from 'next-auth/react'

interface UsersTableClientProps {
    users: UserWithRoleAndProfile[]
}

export function UsersTableClient({ users: initialUsers }: UsersTableClientProps) {
    const { data: session } = useSession()
    const [users, setUsers] = useState<UserWithRoleAndProfile[]>(initialUsers)

    // Handles normal user updates
    const handleUserUpdate = (updatedUser: UserWithRoleAndProfile) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        )
    }

    // Handles user removal
    const handleUserDelete = (deletedUserId: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== deletedUserId))
    }

    // Pass both callbacks into your columns or row actions
    const columns = createColumns(session ?? null, handleUserUpdate, handleUserDelete)

    return <DataTable data={users} columns={columns} selection={false} />
}

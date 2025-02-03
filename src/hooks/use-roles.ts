// src/hooks/use-roles.ts
'use client'

import { useEffect, useState } from 'react'
import { Permission } from '@prisma/client'

interface Role {
    id: string
    name: string
    permissions: { permission: Permission }[]
}

export function useRoles() {
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchRoles() {
            try {
                setLoading(true)
                const response = await fetch('/api/roles')
                const data = await response.json()

                if (!data.success) throw new Error(data.error || 'Failed to fetch roles')

                const rolesWithPermissions = data.roles.map(
                    (role: { id: string; name: string; permissions?: { permission: Permission }[] }) => ({
                        id: role.id,
                        name: role.name,
                        permissions: role.permissions || [],
                    })
                )

                setRoles(rolesWithPermissions)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchRoles()
    }, [])

    return { roles, loading, error }
}

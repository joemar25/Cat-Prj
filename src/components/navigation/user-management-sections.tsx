/**
 * @file src/components/navigation/user-management-sections.tsx
 * @description Dynamically generates user management sections based on roles.
 */

"use client"

import { useRoles } from "@/hooks/use-roles"
import { useEffect, useState } from "react"
import { NavConfig } from "@/lib/types/navigation"
import { getRoleSlug } from "@/types/auth"

interface UserManagementSectionsProps {
    userPermissions: string[]
}

export function UserManagementSections({ userPermissions }: UserManagementSectionsProps) {
    const { roles, loading, error } = useRoles()
    const [sections, setSections] = useState<NonNullable<NavConfig["items"]>>([])

    useEffect(() => {
        if (loading || error) return

        if (roles.length > 0) {
            const roleSections = roles.map(({ name }) => ({
                id: getRoleSlug(name),
                title: `${name}s`,
                url: `/users/${getRoleSlug(name)}`,
            }))

            setSections(roleSections)
        }
    }, [roles, loading, error])

    if (loading) return <p>Loading user sections...</p>
    if (error) return <p>Error fetching roles: {error}</p>

    return (
        <nav>
            <ul>
                {sections.map((section) => (
                    <li key={section.id}>
                        <a href={section.url}>{section.title}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

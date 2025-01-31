// src\context\user-context.tsx
"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { Permission } from "@prisma/client"

interface UserContextProps {
    permissions: Permission[]
}

const UserContext = createContext<UserContextProps | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession()
    const userPermissions = session?.user?.permissions || []

    return (
        <UserContext.Provider value={{ permissions: userPermissions }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}

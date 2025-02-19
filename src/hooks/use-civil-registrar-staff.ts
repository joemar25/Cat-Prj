import { useState, useEffect } from "react"

export type CivilRegistrarStaff = {
    id: string
    name: string
    title: string
    position: string
}

export const useCivilRegistrarStaff = () => {
    const [staff, setStaff] = useState<CivilRegistrarStaff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch("/api/users")
                const data = await response.json()

                if (!data.success) {
                    throw new Error("Failed to fetch staff")
                }

                const formattedStaff: CivilRegistrarStaff[] = data.users.map((user: any) => ({
                    id: user.id,
                    name: user.name,
                    title: user.roles[0]?.role.name || "Unknown Role",
                    position: user.roles[0]?.role.name || "Unknown Position",
                }))

                setStaff(formattedStaff)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchStaff()
    }, [])

    return { staff, loading, error }
}

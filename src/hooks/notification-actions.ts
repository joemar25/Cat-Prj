// src/hooks/notification-actions.ts
import { useState, useEffect, useCallback } from "react"
import { Notification, MarkAsReadInput } from "@/types/notification"

export function useNotificationActions(userId: string) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch unread notifications
    const fetchNotifications = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/notifications?userId=${userId}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to fetch notifications")
            }
            const data = await response.json()
            setNotifications(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch notifications")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    // Mark a notification as read
    const markAsRead = async (input: MarkAsReadInput) => {
        try {
            const response = await fetch(`/api/notifications/${input.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ read: input.read }),
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to mark notification as read")
            }
            // Refetch notifications to update the UI
            await fetchNotifications()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to mark notification as read")
            console.error(err)
        }
    }

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    return {
        notifications,
        isLoading,
        error,
        markAsRead,
        fetchNotifications,
    }
}
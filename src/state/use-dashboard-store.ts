// src/state/use-dashboard-store.ts
import { create } from "zustand"
import { Queue, QueueStatus } from "@prisma/client"

interface DashboardState {
    queues: Queue[]
    stats: { [key in QueueStatus]?: number }
    total: number
    status: QueueStatus | 'all'
    page: number
    limit: number
    totalPages: number
    isLoading: boolean
    error: string | null

    // Actions
    setStatus: (status: QueueStatus | 'all') => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    fetchQueues: () => Promise<void>
    fetchStats: () => Promise<void>
    refreshData: () => Promise<void>
    updateQueueStatus: (id: string, status: QueueStatus) => Promise<void>
    updateNotes: (id: string, notes: string) => Promise<void>
    deleteQueue: (id: string) => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    queues: [],
    stats: {},
    total: 0,
    status: QueueStatus.WAITING, // 'all',
    page: 1,
    limit: 10,
    totalPages: 0,
    isLoading: false,
    error: null,

    setStatus: (status) => set({ status, page: 1 }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),

    fetchQueues: async () => {
        const { status, page, limit } = get()
        try {
            const searchParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            })

            if (status !== 'all') {
                searchParams.append('status', status)
            }

            const response = await fetch(`/api/dashboard/queue?${searchParams.toString()}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch queues')
            }

            const data = await response.json()

            set({
                queues: data.queues,
                total: data.pagination.total,
                totalPages: data.pagination.pages,
            })
        } catch (error) {
            throw error
        }
    },

    fetchStats: async () => {
        try {
            const response = await fetch(`/api/dashboard/queue?aggregate=true`)
            if (!response.ok) throw new Error("Failed to fetch stats")

            const data = await response.json()
            const stats: { [key in QueueStatus]?: number } = {}
            data.stats.forEach((item: { status: QueueStatus; _count: { status: number } }) => {
                stats[item.status] = item._count.status
            })

            set({ stats, total: data.total })
        } catch (error) {
            throw error
        }
    },

    updateQueueStatus: async (id: string, status: QueueStatus) => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, action: 'update' })
            })
            if (!response.ok) throw new Error('Failed to update status')
            await get().refreshData()
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update status' })
        } finally {
            set({ isLoading: false })
        }
    },

    updateNotes: async (id: string, notes: string) => {
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, notes, action: 'update' })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update notes')
            }

            const updatedQueue = await response.json()
            set((state) => ({
                queues: state.queues.map((queue) =>
                    queue.id === id ? updatedQueue : queue
                )
            }))
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update notes' })
            throw error
        }
    },

    deleteQueue: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'delete' })
            })
            if (!response.ok) throw new Error('Failed to delete queue')
            await get().refreshData()
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete queue' })
        } finally {
            set({ isLoading: false })
        }
    },

    refreshData: async () => {
        set({ isLoading: true, error: null })
        try {
            await Promise.all([
                get().fetchQueues(),
                get().fetchStats()
            ])
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to refresh data'
            })
        } finally {
            set({ isLoading: false })
        }
    }
}))
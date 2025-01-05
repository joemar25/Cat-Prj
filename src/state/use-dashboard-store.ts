// src/state/use-dashboard-store.ts
import { create } from "zustand"
import type { Queue, QueueStatus } from "@prisma/client"

interface DashboardState {
    queues: Queue[]
    status: QueueStatus | 'all'
    page: number
    limit: number
    total: number
    totalPages: number
    isLoading: boolean
    error: string | null

    // Actions
    setStatus: (status: QueueStatus | 'all') => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    fetchQueues: () => Promise<void>
    updateQueueStatus: (id: string, status: QueueStatus) => Promise<void>
    updateNotes: (id: string, notes: string) => Promise<void>
    deleteQueue: (id: string) => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
    queues: [],
    status: 'all',
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    setStatus: (status) => set({ status, page: 1 }),
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit, page: 1 }),

    fetchQueues: async () => {
        const { status, page, limit } = get()
        set({ isLoading: true, error: null })

        try {
            const searchParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status !== 'all' && { status })
            })

            const response = await fetch(`/api/dashboard/queue?${searchParams.toString()}`)
            if (!response.ok) throw new Error('Failed to fetch queues')

            const data = await response.json()
            set({
                queues: data.queues,
                total: data.pagination.total,
                totalPages: data.pagination.pages,
                isLoading: false
            })
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch queues',
                isLoading: false,
                queues: []
            })
        }
    },

    updateQueueStatus: async (id: string, status: QueueStatus) => {
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, action: 'update' })
            })
            if (!response.ok) throw new Error('Failed to update status')
            await get().fetchQueues()
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update status' })
        }
    },

    updateNotes: async (id: string, notes: string) => {
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    notes: notes,
                    action: 'update'
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update notes')
            }

            // Update the queue in the local state with the complete updated data
            const updatedQueue = await response.json()
            set(state => ({
                queues: state.queues.map(queue =>
                    queue.id === id ? updatedQueue : queue
                )
            }))
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to update notes' })
            throw error
        }
    },

    deleteQueue: async (id: string) => {
        try {
            const response = await fetch('/api/dashboard/queue', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'delete' })
            })
            if (!response.ok) throw new Error('Failed to delete queue')
            await get().fetchQueues()
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to delete queue' })
        }
    }
}))
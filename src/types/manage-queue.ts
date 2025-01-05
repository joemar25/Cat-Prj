// src/components/custom/manage-queue/types.ts
import { Queue, QueueStatus } from '@prisma/client'

export interface QueueCardProps {
    queue: Queue
    onUpdateStatus: (id: string, status: QueueStatus) => Promise<void>
    onDelete?: (id: string) => Promise<void>
    onUpdateNotes?: (id: string, notes: string) => Promise<void>
    view?: 'grid' | 'list'
}
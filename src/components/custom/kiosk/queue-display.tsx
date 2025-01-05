import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { QueueStatus, ServiceType } from '@prisma/client'

type QueueItem = {
    id: string
    ticketNumber: number
    kioskNumber: number
    status: QueueStatus
    serviceType: ServiceType
    createdAt: string
}

function getStatusColor(status: QueueStatus) {
    const statusColors = {
        [QueueStatus.WAITING]: 'bg-yellow-100 text-yellow-800',
        [QueueStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
        [QueueStatus.COMPLETED]: 'bg-green-100 text-green-800',
        [QueueStatus.CANCELLED]: 'bg-red-100 text-red-800'
    }
    return statusColors[status]
}

function QueueColumn({ title, items, status }: {
    title: string,
    items: QueueItem[],
    status: QueueStatus
}) {
    return (
        <div className="border rounded-lg shadow-sm p-4">
            <div className={`text-center py-2 mb-4 rounded font-semibold ${getStatusColor(status)}`}>
                {title} ({items.length})
            </div>
            <div className="space-y-2">
                {items.map((queue) => (
                    <div
                        key={queue.id}
                        className="p-3 rounded-md flex justify-between items-center transition"
                    >
                        <div>
                            <span className="font-bold text-lg">#{queue.kioskNumber}</span>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatDistanceToNow(new Date(queue.createdAt))} ago
                            </p>
                        </div>
                        <span className="text-xs capitalize">
                            {queue.serviceType.replace('_', ' ').toLowerCase()}
                        </span>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        No items
                    </div>
                )}
            </div>
        </div>
    )
}

export default function QueueManagementPage() {
    const [queues, setQueues] = useState<QueueItem[]>([])

    useEffect(() => {
        const fetchQueues = async () => {
            try {
                const response = await fetch('/api/queue')
                const data = await response.json()
                setQueues(data)
            } catch (error) {
                console.error('Error fetching queues:', error)
            }
        }

        fetchQueues()
        const interval = setInterval(fetchQueues, 5000) // Refresh every 5 seconds
        return () => clearInterval(interval)
    }, [])

    // Separate queues by status
    const queueColumns = {
        [QueueStatus.WAITING]: queues.filter(q => q.status === QueueStatus.WAITING),
        [QueueStatus.PROCESSING]: queues.filter(q => q.status === QueueStatus.PROCESSING),
        [QueueStatus.COMPLETED]: queues.filter(q => q.status === QueueStatus.COMPLETED),
        [QueueStatus.CANCELLED]: queues.filter(q => q.status === QueueStatus.CANCELLED)
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Queue Management</h1>
            <div className="grid grid-cols-4 gap-4">
                <QueueColumn
                    title="Waiting"
                    items={queueColumns[QueueStatus.WAITING]}
                    status={QueueStatus.WAITING}
                />
                <QueueColumn
                    title="Processing"
                    items={queueColumns[QueueStatus.PROCESSING]}
                    status={QueueStatus.PROCESSING}
                />
                <QueueColumn
                    title="Completed"
                    items={queueColumns[QueueStatus.COMPLETED]}
                    status={QueueStatus.COMPLETED}
                />
                <QueueColumn
                    title="Cancelled"
                    items={queueColumns[QueueStatus.CANCELLED]}
                    status={QueueStatus.CANCELLED}
                />
            </div>
        </div>
    )
}
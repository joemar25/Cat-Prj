import React, { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Timer, Users, FileCheck, Ban } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type QueueItem = {
    id: string
    ticketNumber: number
    status: string
    serviceType: string
    email: string | null
    documents: string[]
    createdAt: string
    updatedAt: string
    completedAt: string | null
}

type QueueStats = {
    waiting: number
    processing: number
    completed: number
    cancelled: number
}

function QueueStatusBadge({ status }: { status: string }) {
    const variants = {
        waiting: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        completed: "bg-green-100 text-green-800 hover:bg-green-200",
        cancelled: "bg-red-100 text-red-800 hover:bg-red-200"
    }

    return (
        <Badge variant="outline" className={variants[status as keyof typeof variants]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    )
}

export default function QueueManagementPage() {
    const [queues, setQueues] = useState<QueueItem[]>([])
    const [stats, setStats] = useState<QueueStats>({
        waiting: 0,
        processing: 0,
        completed: 0,
        cancelled: 0
    })
    const [activeTab, setActiveTab] = useState('all')

    useEffect(() => {
        const fetchQueues = async () => {
            try {
                const response = await fetch('/api/queue')
                const data = await response.json()

                // Safely calculate stats
                const newStats = {
                    waiting: data.filter((q: QueueItem) => q.status === 'WAITING').length,
                    processing: data.filter((q: QueueItem) => q.status === 'PROCESSING').length,
                    completed: data.filter((q: QueueItem) => q.status === 'COMPLETED').length,
                    cancelled: data.filter((q: QueueItem) => q.status === 'CANCELLED').length
                }

                setQueues(data)
                setStats(newStats)
            } catch (error) {
                console.error('Error fetching queues:', error)
            }
        }

        fetchQueues()
        const interval = setInterval(fetchQueues, 5000) // Refresh every 5 seconds
        return () => clearInterval(interval)
    }, [])

    const filteredQueues = queues.filter(queue =>
        activeTab === 'all' || queue.status === activeTab
    )

    const StatusIcon = {
        waiting: Timer,
        processing: Users,
        completed: FileCheck,
        cancelled: Ban
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(stats).map(([status, count]) => {
                    const Icon = StatusIcon[status as keyof typeof StatusIcon]
                    return (
                        <Card key={status}>
                            <CardContent className="flex items-center pt-6">
                                <Icon className="h-6 w-6 mr-2" />
                                <div>
                                    <p className="text-sm font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                                    <p className="text-2xl font-bold">{count}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Queue Management</CardTitle>
                    <CardDescription>
                        Monitor and manage service requests in real-time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Requests</TabsTrigger>
                            <TabsTrigger value="waiting">Waiting</TabsTrigger>
                            <TabsTrigger value="processing">Processing</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[600px] mt-4">
                            <div className="space-y-4">
                                {filteredQueues.map((queue) => (
                                    <Card key={queue.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-2xl font-bold">#{queue.ticketNumber}</span>
                                                    <p className="text-sm text-gray-500">
                                                        {queue.serviceType === 'TRUE_COPY' ? 'True Copy Request' : 'Verification'}
                                                    </p>
                                                </div>
                                                <QueueStatusBadge status={queue.status} />
                                            </div>

                                            <div className="space-y-2">
                                                {queue.email && (
                                                    <p className="text-sm">
                                                        <span className="font-medium">Email:</span> {queue.email}
                                                    </p>
                                                )}
                                                {queue.documents && queue.documents.length > 0 && (
                                                    <p className="text-sm">
                                                        <span className="font-medium">Documents:</span>{' '}
                                                        {queue.documents.join(', ')}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Requested {formatDistanceToNow(new Date(queue.createdAt))} ago
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {filteredQueues.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No requests found
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
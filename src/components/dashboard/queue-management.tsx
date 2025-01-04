// src/components/dashboard/queue-management.tsx
"use client"

import { useEffect } from "react"
import { QueueCard } from "./queue-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardStore } from "@/state/use-dashboard-store"
import { QueueStatus } from "@prisma/client"

const statusOptions: { label: string; value: QueueStatus | 'all' }[] = [
    { label: "All Requests", value: "all" },
    { label: "Waiting", value: QueueStatus.WAITING },
    { label: "Processing", value: QueueStatus.PROCESSING },
    { label: "Completed", value: QueueStatus.COMPLETED },
    { label: "Cancelled", value: QueueStatus.CANCELLED }
]

export function QueueManagement() {
    const {
        queues,
        status,
        page,
        total,
        totalPages,
        isLoading,
        error,
        setStatus,
        setPage,
        fetchQueues,
        updateQueueStatus
    } = useDashboardStore()

    useEffect(() => {
        fetchQueues()
    }, [fetchQueues, page, status])

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus as QueueStatus | 'all')
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        {total} requests found
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <QueueSkeletons />
                ) : queues.length === 0 ? (
                    <EmptyState />
                ) : (
                    queues.map((queue) => (
                        <QueueCard
                            key={queue.id}
                            queue={queue}
                            onUpdateStatus={updateQueueStatus}
                        />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    isLoading={isLoading}
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}

function QueueSkeletons() {
    return (
        <>
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="mt-4">
                            <Skeleton className="h-9 w-32" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

function EmptyState() {
    return (
        <Card>
            <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                    No requests found
                </p>
            </CardContent>
        </Card>
    )
}

interface PaginationProps {
    page: number
    totalPages: number
    isLoading: boolean
    onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, isLoading, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1 || isLoading}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
            </Button>
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </p>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages || isLoading}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}
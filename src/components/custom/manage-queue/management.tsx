// src\components\custom\manage-queue\management.tsx
'use client'


import {
    AlertCircle, ChevronLeft, ChevronRight,
    Download, RefreshCw,
    LayoutGrid, List, Search
} from 'lucide-react'
import { QueueCard } from './card'
import { QueueStatus } from '@prisma/client'
import { useDashboardStore } from '@/state/use-dashboard-store'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/custom/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const statusOptions = [
    { label: "All Requests", value: "all" },
    { label: "Waiting", value: QueueStatus.WAITING },
    { label: "Processing", value: QueueStatus.PROCESSING },
    { label: "Completed", value: QueueStatus.COMPLETED },
    { label: "Cancelled", value: QueueStatus.CANCELLED }
]

const limitOptions = [
    { label: "10 per page", value: "10" },
    { label: "25 per page", value: "25" },
    { label: "50 per page", value: "50" }
]

export function QueueManagement() {
    const {
        queues,
        stats,
        total,
        status,
        page,
        limit,
        totalPages,
        isLoading,
        error,
        setStatus,
        setPage,
        setLimit,
        updateQueueStatus,
        updateNotes,
        refreshData,
    } = useDashboardStore()

    const [view, setView] = React.useState<'grid' | 'list'>('list')
    const [searchQuery, setSearchQuery] = React.useState('')

    React.useEffect(() => {
        const fetch = async () => {
            await refreshData()
        }
        fetch()
    }, [refreshData, status, page, limit])

    const handleRefresh = async () => {
        try {
            await refreshData()
        } catch (error) {
            console.error('Failed to refresh:', error)
        }
    }

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus as QueueStatus | 'all')
    }

    const handleExport = () => {
        console.log('Export functionality to be implemented')
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
            {/* Main Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                        leftIcon={<Search className="h-4 w-4" />}
                    />
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
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="hidden sm:flex"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="hidden sm:flex"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                            {limitOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')} className="hidden sm:flex">
                        <TabsList>
                            <TabsTrigger value="grid">
                                <LayoutGrid className="h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="list">
                                <List className="h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {isLoading ? (
                    // Show skeletons while loading
                    Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <Skeleton className="h-4 w-24" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-4 w-32 mt-2" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    Object.entries(stats).map(([status, count]) => (
                        <Card
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {QueueStatus[status as keyof typeof QueueStatus]}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round((count / total) * 100)}% of total
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Queue List */}
            <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
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
                            onUpdateNotes={updateNotes}
                            view={view}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            ({total} total requests)
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages || isLoading}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    )
}

function QueueSkeletons() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
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
                <div className="text-center">
                    <div className="rounded-full bg-muted w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No requests found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your filters or search terms
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
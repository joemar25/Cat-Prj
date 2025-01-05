// src\components\custom\manage-queue\card.tsx
import { useState } from "react"
import { useSession } from "next-auth/react"
import { hasPermission } from "@/types/auth"
import { formatDistanceToNow } from "date-fns"
import {
    Trash2,
    Edit2,
    Save,
    Clock,
    Mail,
    FileText
} from "lucide-react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import { Queue, QueueStatus, ServiceType, Permission } from "@prisma/client"

interface QueueCardProps {
    queue: Queue
    onUpdateStatus: (id: string, status: QueueStatus) => Promise<void>
    onDelete?: (id: string) => Promise<void>
    onUpdateNotes?: (id: string, notes: string) => Promise<void>
    view?: "list" | "grid"
}

const availableActions: Record<QueueStatus, QueueStatus[]> = {
    [QueueStatus.WAITING]: [QueueStatus.PROCESSING, QueueStatus.CANCELLED],
    [QueueStatus.PROCESSING]: [QueueStatus.COMPLETED, QueueStatus.CANCELLED],
    [QueueStatus.COMPLETED]: [],
    [QueueStatus.CANCELLED]: [QueueStatus.WAITING]
}

const statusVariants: Record<
    QueueStatus,
    { variant: "default" | "outline"; className: string }
> = {
    [QueueStatus.WAITING]: {
        variant: "outline",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    },
    [QueueStatus.PROCESSING]: {
        variant: "outline",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200"
    },
    [QueueStatus.COMPLETED]: {
        variant: "outline",
        className: "bg-green-100 text-green-800 hover:bg-green-200"
    },
    [QueueStatus.CANCELLED]: {
        variant: "outline",
        className: "bg-red-100 text-red-800 hover:bg-red-200"
    }
}

export function QueueCard({
    queue,
    onUpdateStatus,
    onDelete,
    onUpdateNotes,
}: QueueCardProps) {
    const { data: session } = useSession()
    const [isEditingNotes, setIsEditingNotes] = useState(false)
    const [notes, setNotes] = useState(queue.processingNotes || "")
    const [isSaving, setIsSaving] = useState(false)

    const canProcess = hasPermission(
        session?.user?.permissions as Permission[],
        Permission.QUEUE_PROCESS
    )
    const canDelete = hasPermission(
        session?.user?.permissions as Permission[],
        Permission.QUEUE_DELETE
    )
    const canAddNotes = hasPermission(
        session?.user?.permissions as Permission[],
        Permission.QUEUE_ADD_NOTES
    )

    const handleSaveNotes = async () => {
        if (onUpdateNotes && notes !== queue.processingNotes) {
            setIsSaving(true)
            try {
                await onUpdateNotes(queue.id, notes)
                setIsEditingNotes(false)
            } catch (error) {
                console.error("Failed to save notes:", error)
            } finally {
                setIsSaving(false)
            }
        } else {
            setIsEditingNotes(false)
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                    <CardTitle>#{queue.kioskNumber}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {queue.serviceType === ServiceType.TRUE_COPY
                            ? "True Copy Request"
                            : "Verification"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={statusVariants[queue.status].variant}
                        className={statusVariants[queue.status].className}
                    >
                        {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                    </Badge>
                    {canDelete && onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this request? This action
                                        cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(queue.id)}
                                        className="bg-destructive text-destructive-foreground"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardHeader>

            <CardContent className="grid gap-4 py-2">
                {/* Responsive grid for details: 
            - 1 col on small screens
            - 2 cols on sm screens
            - 3 cols on md screens and above */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {queue.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-muted-foreground">{queue.email}</p>
                            </div>
                        </div>
                    )}
                    {queue.documents && queue.documents.length > 0 && (
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Requested Document(s)</p>
                                <p className="text-sm text-muted-foreground">
                                    {queue.documents
                                        .map(
                                            (doc) => doc.charAt(0).toUpperCase() + doc.slice(1)
                                        )
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Requested</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(queue.createdAt))} ago
                            </p>
                        </div>
                    </div>
                </div>

                {/* Processing Notes Section */}
                {canAddNotes && (
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <p className="text-sm font-medium">Processing Notes</p>
                            {!isEditingNotes ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditingNotes(true)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSaveNotes}
                                    disabled={isSaving}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {isEditingNotes ? (
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="resize-none"
                                placeholder="Add processing notes..."
                                disabled={isSaving}
                                autoFocus
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {queue.processingNotes || "No notes added"}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            {/* Action Buttons (e.g., Mark as Processing, Completed, etc.) */}
            {canProcess && availableActions[queue.status].length > 0 && (
                <CardFooter className="py-2">
                    <div className="flex flex-wrap gap-2">
                        {availableActions[queue.status].map((action) => (
                            <Button
                                key={action}
                                variant="secondary"
                                size="sm"
                                onClick={() => onUpdateStatus(queue.id, action)}
                            >
                                Mark as {action.charAt(0).toUpperCase() + action.slice(1)}
                            </Button>
                        ))}
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}

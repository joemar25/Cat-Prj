// src\components\custom\civil-registry\components\status-dropdown.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DocumentStatus } from '@prisma/client'
import { updateFormStatus } from '@/hooks/update-status-action'

export const statusVariants: Record<
    DocumentStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
    PENDING: { label: 'Pending', variant: 'secondary' },
    VERIFIED: { label: 'Verified', variant: 'default' },
    LATE_REGISTRATION: { label: 'Late Registration', variant: 'destructive' },
    READY_FOR_RELEASE: { label: 'Ready for Release', variant: 'default' },
    RELEASED: { label: 'Released', variant: 'default' },
}

interface StatusSelectProps {
    formId: string
    currentStatus: DocumentStatus
    onStatusChange?: (newStatus: DocumentStatus) => void
}

export default function StatusSelect({
    formId,
    currentStatus,
    onStatusChange,
}: StatusSelectProps) {
    const [loading, setLoading] = useState(false)

    const updateStatus = async (newStatus: DocumentStatus) => {
        setLoading(true)
        try {
            // Call the server action (or your custom hook) directly to update status in the database
            await updateFormStatus(formId, newStatus)
            toast.success('Status updated successfully')
            onStatusChange?.(newStatus)
        } catch (error: unknown) {
            console.error(error)
            toast.error('Failed to update status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Select
            value={currentStatus}
            onValueChange={(newStatus) => updateStatus(newStatus as DocumentStatus)}
        >
            <SelectTrigger disabled={loading} className="w-[180px]">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(statusVariants).map(([statusKey, statusInfo]) => (
                    <SelectItem key={statusKey} value={statusKey}>
                        {statusInfo.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// src/components/custom/requests/requests-table-client.tsx
'use client'

import { useState } from 'react'
import { DataTable } from '@/components/custom/requests/data-table'
import { createColumns } from '@/components/custom/requests/columns'
import { ExtendedCertifiedCopy } from '@/types/certified-true-copy'

interface RequestsTableClientProps {
    requests: ExtendedCertifiedCopy[]
}

export function RequestsTableClient({ requests: initialRequests }: RequestsTableClientProps) {
    const [requests, setRequests] = useState<ExtendedCertifiedCopy[]>(initialRequests)

    const handleRequestUpdate = (updatedRequest: ExtendedCertifiedCopy) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === updatedRequest.id ? updatedRequest : request
            )
        )
    }

    const columns = createColumns(handleRequestUpdate)

    return <DataTable data={requests} columns={columns} selection={false} />
}
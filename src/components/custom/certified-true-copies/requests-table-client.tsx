// src/components/custom/certified-true-copies/requests-table-client.tsx
'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/icons'
import { ExtendedCertifiedCopy } from '@/types/certified-true-copy'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { DataTable } from '@/components/custom/certified-true-copies/data-table'
import { createColumns } from '@/components/custom/certified-true-copies/columns'

interface RequestsTableClientProps {
  requests: ExtendedCertifiedCopy[]
}

export function RequestsTableClient({
  requests: initialRequests,
}: RequestsTableClientProps) {
  const [requests, setRequests] = useState<ExtendedCertifiedCopy[]>(initialRequests)

  const handleRequestUpdate = (updatedRequest: ExtendedCertifiedCopy) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request
      )
    )
  }

  const columns = createColumns(handleRequestUpdate)

  return (
    <>
      <Alert>
        <Icons.infoCircledIcon className="h-4 w-4" />
        <AlertTitle>Notification</AlertTitle>
        <AlertDescription>
          On Debug Mode - Unfinished.

          <ul className="list-disc list-inside mt-2">
            <li>Implement request approval functionality</li>
            <li>Implement request cancel functionality</li>
            <li>Style the view row dialog for better readability</li>
            <li>Connect with backend API for real-time updates</li>
            <li>Attachments for the CTC can be clickable</li>
            <li>Export must work</li>
          </ul>
        </AlertDescription>
      </Alert>
      <DataTable data={requests} columns={columns} selection={false} />
    </>
  )
}
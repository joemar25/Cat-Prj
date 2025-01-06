// src\app\(dashboard)\manage-queue\page.tsx
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header.tsx"
import { QueueManagement } from "@/components/custom/manage-queue/management"

export default async function ManageQueue() {

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Manage Queue', href: '/manage-queue', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        <QueueManagement />
      </div>
    </>
  )
}
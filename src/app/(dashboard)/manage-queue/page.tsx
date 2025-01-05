// src\app\(dashboard)\manage-queue\page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/custom/dashboard/header"
import { QueueManagement } from "@/components/custom/manage-queue/management"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/sign-in")

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
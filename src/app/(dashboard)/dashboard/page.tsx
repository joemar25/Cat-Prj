import { DashboardHeader } from "@/components/custom/dashboard/header"

export default async function DashboardPage() {

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        Charts Here
      </div>
    </>
  )
}
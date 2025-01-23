import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header"

export default async function SettingsPage() {

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Settings', href: '/settings', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4 p-4'>
        Settings Hello
      </div>
    </>
  )
}
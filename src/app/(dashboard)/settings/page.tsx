import { SettingsUI } from "./settings-ui"
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header"

export default async function SettingsPage() {

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: false },
          { label: 'Settings', href: '/settings', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4'>
        <SettingsUI />
      </div>
    </>
  )
}
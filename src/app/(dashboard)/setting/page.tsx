import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header"
import { SettingsUI } from "./settingsUI"

export default async function SettingsPage() {

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: 'Settings', href: '/setting', active: true },
        ]}
      />

      <div className='flex flex-1 flex-col gap-4'>
        <SettingsUI/>
      </div>
    </>
  )
}
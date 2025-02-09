// src\app\(dashboard)\settings\page.tsx
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

      <div className="flex-1 p-4 space-y-4">
        <SettingsUI />
      </div>
    </>
  )
}
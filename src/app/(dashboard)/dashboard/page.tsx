import ChartsDashboard from "./components/charts"
import MetricsDashboard from "./components/metrics"
import StatisticsDashboard from "./components/statistics"

import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header.tsx"

export default async function DashboardPage() {

  return (
    <div className="w-full h-full flex flex-1 flex-col">
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: true },
        ]}
      />

      <div className="w-full h-fit flex flex-1 flex-col gap-4 p-4">
        {/* Charts Here */}
        <MetricsDashboard />
        <ChartsDashboard />
        <StatisticsDashboard />
      </div>
    </div>
  )
}

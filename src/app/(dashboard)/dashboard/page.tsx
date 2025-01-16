import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react'
import MetricsDashboard from "./components/metrics"
import StatisticsDashboard from "./components/statistics"
import ChartsDashboard from "./components/charts"


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

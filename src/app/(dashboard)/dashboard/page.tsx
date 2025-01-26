import { Icons } from "@/components/ui/icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DashboardHeader } from "@/components/custom/dashboard/dashboard-header"

import Link from "next/link"
import ChartsDashboard from "@/components/custom/dashboard/components/charts"
import MetricsDashboard from "@/components/custom/dashboard/components/metrics"
import StatisticsDashboard from "@/components/custom/dashboard/components/statistics"

export default async function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-1 flex-col">
      <DashboardHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard', active: true },
        ]}
      />

      <div className="w-full h-fit flex flex-1 flex-col gap-4 p-4">
        {/* Notification Alert */}
        <Alert>
          <Icons.infoCircledIcon className="h-4 w-4" />
          <AlertTitle>Summary View</AlertTitle>
          <AlertDescription>
            This dashboard provides a summary of the charts and metrics. For more detailed reports or to generate custom reports, navigate to the{" "}
            <Link href="/reports" className="text-blue-700 underline hover:text-blue-900">
              Reports section
            </Link>
            .
          </AlertDescription>
        </Alert>

        {/* Dashboard Components */}
        <MetricsDashboard />
        <StatisticsDashboard />
        <ChartsDashboard />
      </div>
    </div>
  )
}
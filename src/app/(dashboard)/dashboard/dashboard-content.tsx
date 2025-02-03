"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import ChartsDashboard from "@/components/custom/dashboard/components/charts"
import MetricsDashboard from "@/components/custom/dashboard/components/metrics"
import StatisticsDashboard from "@/components/custom/dashboard/components/statistics"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardContent() {
  const { t } = useTranslation()
  const [selectedMetric, setSelectedMetric] = useState<{
    model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm" | null
    currentCount: number | null
  }>({
    model: null,
    currentCount: null,
  })

  const handleSelectMetric = (model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm", currentCount: number) => {
    setSelectedMetric({ model, currentCount })
  }

  return (
    <div className="w-full h-fit flex flex-1 flex-col gap-4 p-4">
      <Alert>
        <Icons.infoCircledIcon className="h-4 w-4" />
        <AlertTitle>{t("summary_view")}</AlertTitle>
        <AlertDescription>
          {t("dashboard_description")}{" "}
          <Link href="/reports" className="text-blue-700 underline hover:text-blue-900">
            {t("reports_section")}
          </Link>
          .
        </AlertDescription>
      </Alert>

      <MetricsDashboard onSelectMetric={handleSelectMetric} />

      <StatisticsDashboard selectedMetric={selectedMetric} />

      <ChartsDashboard />
    </div>
  )
}

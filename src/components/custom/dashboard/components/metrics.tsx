"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations } from "@/hooks/count-metrics"
import { useTranslation } from "react-i18next"

interface MetricItem {
  model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"
  titleKey: string
  icon: JSX.Element
}

interface Metric {
  titleKey: string
  currentCount: number
  percentageChange: number
  icon: JSX.Element
  model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"
}

const METRIC_ITEMS: MetricItem[] = [
  {
    model: "baseRegistryForm",
    titleKey: "metrics.total_registrations",
    icon: <Icons.user className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "birthCertificateForm",
    titleKey: "metrics.birth_certificates",
    icon: <Icons.cake className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "deathCertificateForm",
    titleKey: "metrics.death_certificates",
    icon: <Icons.notebookText className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "marriageCertificateForm",
    titleKey: "metrics.marriage_certificates",
    icon: <Icons.gem className="h-4 w-4 text-muted-foreground" />
  },
]

export default function MetricsDashboard({
  onSelectMetricAction, // Renamed here
}: {
  onSelectMetricAction: (
    model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm",
    currentCount: number
  ) => void;
}) {
  const { t } = useTranslation()
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string>("metrics.total_registrations")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await Promise.all(
          METRIC_ITEMS.map(async ({ model, titleKey, icon }) => {
            const [currentCount, previousCount] = await Promise.all([
              getCurrentMonthRegistrations(model),
              getPreviousMonthRegistrations(model),
            ])
            const percentageChange =
              previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100

            return {
              titleKey,
              currentCount,
              percentageChange,
              icon,
              model,
            }
          })
        )

        setMetrics(data)
      } catch (err) {
        setError(t("metrics.fetch_error"))
        console.error("Error fetching metrics:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [t])

  const handleSelectMetric = (
    titleKey: string,
    model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm",
    currentCount: number
  ) => {
    setSelectedMetric(titleKey)
    onSelectMetricAction(model, currentCount) // Updated here
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((_, index) => (
          <Card key={index} className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/2" /> {/* Title skeleton */}
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon skeleton */}
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-3/4 mb-2" /> {/* Current count skeleton */}
              <Skeleton className="h-3 w-1/2" /> {/* Percentage skeleton */}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.titleKey}
          className={`cursor-pointer transition-all ${selectedMetric === metric.titleKey ? "text-white" : ""} 
          ${selectedMetric === metric.titleKey ? "bg-chart-2" : "bg-transparent"}`}
         
          onClick={() => handleSelectMetric(metric.titleKey, metric.model, metric.currentCount)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t(metric.titleKey)}</CardTitle>
            <CardDescription className="text-white"> {metric.icon}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.currentCount.toLocaleString()}</div>
            <p className={`text-xs ${selectedMetric === metric.titleKey ? "text-white/80" : "text-muted-foreground"}`}>
              <span className="">
                {metric.percentageChange > 0 ? "+" : ""}
                {metric.percentageChange.toFixed(1)}% {t("metrics.from_last_month")}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

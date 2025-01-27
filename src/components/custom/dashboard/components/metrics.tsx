"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations } from "@/hooks/count-metrics"
import { useTranslation } from "react-i18next" // Import the translation hook

interface MetricItem {
  model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"
  titleKey: string // Use translation keys instead of hardcoded text
  icon: JSX.Element
}

interface Metric {
  titleKey: string // Use translation keys instead of hardcoded text
  currentCount: number
  percentageChange: number
  icon: JSX.Element
}

const METRIC_ITEMS: MetricItem[] = [
  {
    model: "baseRegistryForm",
    titleKey: "metrics.total_registrations", // Translation key
    icon: <Icons.user className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "birthCertificateForm",
    titleKey: "metrics.birth_certificates", // Translation key
    icon: <Icons.cake className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "deathCertificateForm",
    titleKey: "metrics.death_certificates", // Translation key
    icon: <Icons.notebookText className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "marriageCertificateForm",
    titleKey: "metrics.marriage_certificates", // Translation key
    icon: <Icons.gem className="h-4 w-4 text-muted-foreground" />
  },
]

export default function MetricsDashboard() {
  const { t } = useTranslation() // Initialize the translation function
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await Promise.all(
          METRIC_ITEMS.map(async ({ model, titleKey, icon }) => {
            const [currentCount, previousCount] = await Promise.all([
              getCurrentMonthRegistrations(model),
              getPreviousMonthRegistrations(model)
            ])

            const percentageChange = previousCount === 0
              ? 100
              : ((currentCount - previousCount) / previousCount) * 100

            return {
              titleKey, // Use the translation key
              currentCount,
              percentageChange,
              icon
            }
          })
        )

        setMetrics(data)
      } catch (err) {
        setError(t("metrics.fetch_error")) // Translated error message
        console.error("Error fetching metrics:", err)
      }
    }

    void fetchMetrics()
  }, [t]) // Add `t` to the dependency array

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.titleKey}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t(metric.titleKey)} {/* Translate the title */}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.currentCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metric.percentageChange > 0 ? "+" : ""}
              {metric.percentageChange.toFixed(1)}% {t("metrics.from_last_month")} {/* Translate the suffix */}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
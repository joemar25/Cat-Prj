"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations } from "@/hooks/count-metrics"

interface MetricItem {
  model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"
  title: string
  icon: JSX.Element
}

interface Metric {
  title: string
  currentCount: number
  percentageChange: number
  icon: JSX.Element
}

const METRIC_ITEMS: MetricItem[] = [
  {
    model: "baseRegistryForm",
    title: "Total Registrations",
    icon: <Icons.user className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "birthCertificateForm",
    title: "Birth Certificates",
    icon: <Icons.cake className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "deathCertificateForm",
    title: "Death Certificates",
    icon: <Icons.notebookText className="h-4 w-4 text-muted-foreground" />
  },
  {
    model: "marriageCertificateForm",
    title: "Marriage Certificates",
    icon: <Icons.gem className="h-4 w-4 text-muted-foreground" />
  },
]

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await Promise.all(
          METRIC_ITEMS.map(async ({ model, title, icon }) => {
            const [currentCount, previousCount] = await Promise.all([
              getCurrentMonthRegistrations(model),
              getPreviousMonthRegistrations(model)
            ])

            const percentageChange = previousCount === 0
              ? 100
              : ((currentCount - previousCount) / previousCount) * 100

            return {
              title,
              currentCount,
              percentageChange,
              icon
            }
          })
        )

        setMetrics(data)
      } catch (err) {
        setError("Failed to fetch metrics data")
        console.error("Error fetching metrics:", err)
      }
    }

    void fetchMetrics()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.currentCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metric.percentageChange > 0 ? "+" : ""}
              {metric.percentageChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
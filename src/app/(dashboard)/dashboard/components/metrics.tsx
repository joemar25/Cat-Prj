"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Cake, NotebookText, Gem } from "lucide-react"
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations, PrismaModels } from "@/hooks/count-metrics"

type Metric = {
  title: string
  currentCount: number
  percentageChange: number
  icon: JSX.Element
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    async function fetchMetrics() {
      const models: { model: PrismaModels; title: string; icon: JSX.Element }[] = [
        { model: "baseRegistryForm", title: "Total", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { model: "birthCertificateForm", title: "Birth Certificates", icon: <Cake className="h-4 w-4 text-muted-foreground" /> },
        { model: "deathCertificateForm", title: "Death Certificates", icon: <NotebookText className="h-4 w-4 text-muted-foreground" /> },
        { model: "marriageCertificateForm", title: "Marriage Certificates", icon: <Gem className="h-4 w-4 text-muted-foreground" /> },
      ]

      const data = await Promise.all(
        models.map(async ({ model, title, icon }) => {
          const currentCount = await getCurrentMonthRegistrations(model)
          const previousCount = await getPreviousMonthRegistrations(model)

          const percentageChange =
            previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100

          return { title, currentCount, percentageChange, icon }
        })
      )

      setMetrics(data)
    }

    fetchMetrics()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.currentCount}</div>
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

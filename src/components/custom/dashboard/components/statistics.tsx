"use client"

import { useEffect, useMemo, useState } from "react"
import { getRegistryMetrics } from "@/hooks/count-metrics"
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"

const areaChartConfig = {
  birth: { label: "Birth", color: "hsl(var(--chart-1))" },
  death: { label: "Death", color: "hsl(var(--chart-2))" },
  marriage: { label: "Marriage", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

const pieChartConfig = {
  birth: { label: "Births", color: "hsl(var(--chart-1))" },
  death: { label: "Deaths", color: "hsl(var(--chart-2))" },
  marriage: { label: "Marriages", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

interface RegistryStatisticsDashboardProps {
  selectedMetric: {
    model: "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm" | null;
    currentCount: number | null;
  };
}

export default function RegistryStatisticsDashboard({ selectedMetric }: RegistryStatisticsDashboardProps) {
  const { t } = useTranslation()
  const [chartData, setChartData] = useState<{ month: string; birth: number; death: number; marriage: number }[]>([])
  const [trend, setTrend] = useState({ percentage: "0", isUp: true })
  const [isLoading, setIsLoading] = useState(true)

  const pieData = useMemo(() => {
    const model = selectedMetric.model || "baseRegistryForm"

    if (model === "baseRegistryForm") {
      const totalBirths = chartData.reduce((sum, item) => sum + item.birth, 0)
      const totalDeaths = chartData.reduce((sum, item) => sum + item.death, 0)
      const totalMarriages = chartData.reduce((sum, item) => sum + item.marriage, 0)

      return [
        { name: t("births"), value: totalBirths, fill: pieChartConfig.birth.color },
        { name: t("deaths"), value: totalDeaths, fill: pieChartConfig.death.color },
        { name: t("marriages"), value: totalMarriages, fill: pieChartConfig.marriage.color },
      ]
    }

    const modelKey = model === "marriageCertificateForm" ? "marriage"
      : model === "birthCertificateForm" ? "birth"
        : model === "deathCertificateForm" ? "death"
          : null

    if (!modelKey) return []

    return chartData.map(item => ({
      name: item.month,
      value: item[modelKey],
      fill: pieChartConfig[modelKey].color,
    }))
  }, [chartData, selectedMetric, t])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { monthlyData, trend } = await getRegistryMetrics()
        setChartData(monthlyData)
        setTrend(trend)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Area Chart Skeleton */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/4" />
          </CardFooter>
        </Card>

        {/* Pie Chart Skeleton */}
        <Card className="flex flex-col lg:col-span-3">
          <CardHeader className="text-center">
            <Skeleton className="h-6 w-1/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </CardHeader>
          <CardContent className="flex-1 flex justify-center items-center">
            <Skeleton className="rounded-full h-[250px] w-[250px]" />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Area Chart */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>{t("registry_statistics")}</CardTitle>
          <CardDescription>{t("monthly_registration_trends")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaChartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="marriage" stackId="1" stroke={areaChartConfig.marriage.color} fill={areaChartConfig.marriage.color} fillOpacity={selectedMetric.model === "marriageCertificateForm" ? 0.7 : 0.4} />
                <Area type="monotone" dataKey="death" stackId="1" stroke={areaChartConfig.death.color} fill={areaChartConfig.death.color} fillOpacity={selectedMetric.model === "deathCertificateForm" ? 0.7 : 0.4} />
                <Area type="monotone" dataKey="birth" stackId="1" stroke={areaChartConfig.birth.color} fill={areaChartConfig.birth.color} fillOpacity={selectedMetric.model === "birthCertificateForm" ? 0.7 : 0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {trend.isUp ? (
                  <>
                    {t("trending_up", { percentage: trend.percentage })}
                    <TrendingUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t("trending_down", { percentage: trend.percentage })}
                    <TrendingDown className="h-4 w-4" />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {t("showing_registration_data")}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Pie Chart */}
      <Card className="flex flex-col lg:col-span-3">
        <CardHeader className="text-center">
          <CardTitle>{t(`${selectedMetric.model}_distribution`)}</CardTitle>
          <CardDescription>{t(`past_six_months_${selectedMetric.model}_statistics`)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="90%" strokeWidth={2} paddingAngle={2}>
                  <Label content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                            {pieData.reduce((total, item) => total + item.value, 0).toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                            {t(`total_${selectedMetric.model}`)}
                          </tspan>
                        </text>
                      )
                    }
                  }} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <PieChartIcon className="h-4 w-4" />
            {t(`${selectedMetric.model}_registration_distribution`)}
          </div>
          <span className="text-muted-foreground">
            {t(`monthly_breakdown_${selectedMetric.model}`)}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

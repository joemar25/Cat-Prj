"use client"

import { useEffect, useMemo, useState } from "react"
import { getRegistryMetrics } from "@/hooks/count-metrics"
import { TrendingUp, TrendingDown, PieChart as PieChartIcon } from "lucide-react"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next" // Import the translation hook

const areaChartConfig = {
  birth: {
    label: "Birth",
    color: "hsl(var(--chart-1))",
  },
  death: {
    label: "Death",
    color: "hsl(var(--chart-2))",
  },
  marriage: {
    label: "Marriage",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const pieChartConfig = {
  marriage: {
    label: "Marriages",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

interface AreaChartProps {
  data: { month: string; birth: number; death: number; marriage: number }[]
}

export default function RegistryStatisticsDashboard() {
  const { t } = useTranslation() // Initialize the translation function
  const [chartData, setChartData] = useState<AreaChartProps["data"]>([])
  const [trend, setTrend] = useState({ percentage: "0", isUp: true })
  const [isLoading, setIsLoading] = useState(true)

  // Calculate total marriages from the data
  const totalMarriages = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.marriage, 0)
  }, [chartData])

  // Transform data for pie chart
  const pieData = useMemo(() => {
    return chartData.map((item) => ({
      name: item.month,
      value: item.marriage,
      fill: `hsl(var(--chart-3) / ${(item.marriage / Math.max(...chartData.map((d) => d.marriage))) * 0.9 +
        0.1
        })`,
    }))
  }, [chartData])

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
    return <div>{t("loading_statistics")}</div> // Translated loading message
  }

  return (
    <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>{t("registry_statistics")}</CardTitle> {/* Translated title */}
          <CardDescription>
            {t("monthly_registration_trends")} {/* Translated description */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaChartConfig}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  type="monotone"
                  dataKey="marriage"
                  stackId="1"
                  stroke={areaChartConfig.marriage.color}
                  fill={areaChartConfig.marriage.color}
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="death"
                  stackId="1"
                  stroke={areaChartConfig.death.color}
                  fill={areaChartConfig.death.color}
                  fillOpacity={0.4}
                />

                <Area
                  type="monotone"
                  dataKey="birth"
                  stackId="1"
                  stroke={areaChartConfig.birth.color}
                  fill={areaChartConfig.birth.color}
                  fillOpacity={0.4}
                />
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
                    {t("trending_up", { percentage: trend.percentage })} {/* Translated trending up message */}
                    <TrendingUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t("trending_down", { percentage: trend.percentage })} {/* Translated trending down message */}
                    <TrendingDown className="h-4 w-4" />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {t("showing_registration_data")} {/* Translated description */}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="flex flex-col lg:col-span-3">
        <CardHeader className="text-center">
          <CardTitle>{t("marriage_distribution")}</CardTitle> {/* Translated title */}
          <CardDescription>
            {t("past_six_months_marriage_statistics")} {/* Translated description */}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalMarriages.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              {t("total_marriages")} {/* Translated label */}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <PieChartIcon className="h-4 w-4" />
            {t("marriage_registration_distribution")} {/* Translated title */}
          </div>
          <span className="text-muted-foreground">
            {t("monthly_breakdown_marriages")} {/* Translated description */}
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
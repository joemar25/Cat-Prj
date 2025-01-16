"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  getBirthGenderCount,
  getRecentRegistrations,
} from "@/hooks/count-metrics";

const chartConfig = {
  views: {
    label: "Birth Registrations",
  },
  male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ChartsDashboard() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("male");
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [recentRegistrations, setRecentRegistrations] = React.useState<any[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const genderCountData = await getBirthGenderCount();
      setChartData(genderCountData);

      const recentRegistrationsData = await getRecentRegistrations();
      setRecentRegistrations(recentRegistrationsData);
    };

    fetchData();
  }, []);

  const total = React.useMemo(
    () => ({
      male: chartData.reduce((acc, curr) => acc + curr.male, 0),
      female: chartData.reduce((acc, curr) => acc + curr.female, 0),
    }),
    [chartData]
  );

  return (
    <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-full">
      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Birth Registration Overview</CardTitle>
            <CardDescription>
              Showing total birth registrations by gender
            </CardDescription>
          </div>
          <div className="flex">
            {["male", "female"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-10 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left 
                    even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 
                    hover:bg-muted/30 transition-colors"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-2xl">
                    {total[key as keyof typeof total]?.toLocaleString() || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="h-[350px] w-full pt-6"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 h-full max-h-[32rem] flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest birth registrations</CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="space-y-8">
            {recentRegistrations.map((registration) => (
              <div className="flex items-center" key={registration.name}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {(() => {
                      const parts = registration.name.split(", ");
                      const lastInitial = parts[0]?.[0] || ""; // First letter of the last name
                      const firstAndMiddle = parts[1]?.split(" ") || [];
                      const firstInitial = firstAndMiddle[0]?.[0] || ""; // First letter of the first name
                      return `${firstInitial}${lastInitial}`.toUpperCase(); // Combine and convert to uppercase
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {registration.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date of birth: {registration.dateOfBirth}
                  </p>
                </div>
                <div className="ml-auto font-medium">{registration.sex}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

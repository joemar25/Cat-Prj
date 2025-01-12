"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { getCurrentMonthRegistrations, getPreviousMonthRegistrations, PrismaModels } from "@/hooks/count-metrics";

type Metric = {
  title: string;
  currentCount: number;
  percentageChange: number;
};

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      const models: { model: PrismaModels; title: string }[] = [
        { model: "baseRegistryForm", title: "Registered Users" },
        { model: "birthCertificateForm", title: "Birth Certificates" },
        { model: "deathCertificateForm", title: "Death Certificates" },
        { model: "marriageCertificateForm", title: "Marriage Certificates" },
      ];

      const data = await Promise.all(
        models.map(async ({ model, title }) => {
          const currentCount = await getCurrentMonthRegistrations(model);
          const previousCount = await getPreviousMonthRegistrations(model);

          const percentageChange =
            previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100;

          return { title, currentCount, percentageChange };
        })
      );

      setMetrics(data);
    }

    fetchMetrics();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
  );
}

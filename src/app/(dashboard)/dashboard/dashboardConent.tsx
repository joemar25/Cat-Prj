// app/(dashboard)/dashboard/DashboardContent.tsx
"use client"; // Mark this as a client component

import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import ChartsDashboard from "@/components/custom/dashboard/components/charts";
import MetricsDashboard from "@/components/custom/dashboard/components/metrics";
import StatisticsDashboard from "@/components/custom/dashboard/components/statistics";
import { useTranslation } from "react-i18next"; // Use the translation hook

export default function DashboardContent() {
  const { t } = useTranslation(); // Initialize the translation function

  return (
    <div className="w-full h-fit flex flex-1 flex-col gap-4 p-4">
      {/* Notification Alert */}
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

      {/* Dashboard Components */}
      <MetricsDashboard />
      <StatisticsDashboard />
      <ChartsDashboard />
    </div>
  );
}
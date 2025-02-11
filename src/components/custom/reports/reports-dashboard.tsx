"use client"

import { useState } from "react"
import { Icons } from '@/components/ui/icons'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BirthReport } from "./birth-report"
import { DeathReport } from "./death-report"
import * as Tooltip from '@radix-ui/react-tooltip'
import { DocumentReport } from "./document-report"
import { MarriageReport } from "./marriage-report"
import { UserActivityReport } from "./user-activity-report"
import { useTranslation } from "react-i18next"

export type ReportKey = "document" | "user-activity" | "marriage" | "birth" | "death"

const reports: { key: ReportKey; labelKey: string }[] = [
    { key: "document", labelKey: "document_requests" },
    { key: "user-activity", labelKey: "user_activity" },
    { key: "marriage", labelKey: "marriage_reports" },
    { key: "birth", labelKey: "birth_reports" },
    { key: "death", labelKey: "death_reports" },
]

export const ReportsDashboard = () => {
    const [selectedReport, setSelectedReport] = useState<ReportKey>("document")
    const { t } = useTranslation()

    const renderReport = () => {
        switch (selectedReport) {
            case "document":
                return <DocumentReport />
            case "user-activity":
                return <UserActivityReport />
            case "marriage":
                return <MarriageReport />
            case "birth":
                return <BirthReport />
            case "death":
                return <DeathReport />
            default:
                return null
        }
    }

    return (
        <div className="w-full ml-0 mr-auto relative">
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <Icons.infoCircledIcon className="h-4 w-4 cursor-pointer absolute left-5 -top-1" />
                    </Tooltip.Trigger>
                    <Tooltip.Content className="bg-white p-4 rounded shadow-lg max-w-md mt-20 dark:bg-muted" side="right">
                        <AlertTitle>{t('reports')}</AlertTitle>
                        <AlertDescription>
                            {t('tooltip_description')}
                        </AlertDescription>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>

            <div className="w-full">
                <CardHeader>
                    <CardTitle>{t('reports_dashboard')}</CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                    <Tabs
                        value={selectedReport}
                        onValueChange={(value) => setSelectedReport(value as ReportKey)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full max-w-[700px] p-1 grid-cols-2 lg:grid-cols-5 mb-6 max-h-10">
                            {reports.map((report) => (
                                <TabsTrigger key={report.key} value={report.key} className="p-1 px-4">
                                    {t(report.labelKey)} {/* Use the translated label key here */}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {reports.map((report) => (
                            <TabsContent key={report.key} value={report.key} className="w-full max-w-[1000px]">
                                <div className="w-full">{renderReport()}</div> {/* Ensures content inside takes full width */}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </div>
        </div>
    )
}

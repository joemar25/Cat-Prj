"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BirthReport } from "./birth-report"
import { DeathReport } from "./death-report"
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
                                    {t(report.labelKey)}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {reports.map((report) => (
                            <TabsContent key={report.key} value={report.key} className="w-full max-w-[1000px]">
                                <div className="w-full">{renderReport()}</div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Icons } from '@/components/ui/icons'
import { useTranslation } from 'react-i18next'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DocumentReport } from "./document-report"
import { UserActivityReport } from "./user-activity-report"
import { MarriageReport } from "./marriage-report"
import { BirthReport } from "./birth-report"
import { DeathReport } from "./death-report"

export type ReportKey = "document" | "user-activity" | "marriage" | "birth" | "death"

const reports: { key: ReportKey; label: string }[] = [
    { key: "document", label: "Document Requests" },
    { key: "user-activity", label: "User Activity" },
    { key: "marriage", label: "Marriage Reports" },
    { key: "birth", label: "Birth Reports" },
    { key: "death", label: "Death Reports" },
]
export const ReportsDashboard = () => {
    const [selectedReport, setSelectedReport] = useState<ReportKey>("document")

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
        <div className="w-full ml-0 mr-auto">
            <Alert>
                <Icons.infoCircledIcon className="h-4 w-4" />
                <AlertTitle>Reports</AlertTitle>
                <AlertDescription>
                    Design is not final. But it is functional. Please provide feedback.
                </AlertDescription>
            </Alert>
            <div className="w-full">
                <CardHeader>
                    <CardTitle>Reports Dashboard</CardTitle>
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
                                    {report.label}
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

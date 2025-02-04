"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Import your report components
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
        <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="md:w-1/4 p-4">
                <h2 className="mb-4 text-lg font-semibold">Reports</h2>
                <ul className="space-y-2">
                    {reports.map((report) => (
                        <li key={report.key}>
                            <Button
                                variant={selectedReport === report.key ? "default" : "outline"}
                                className="w-full text-left"
                                onClick={() => setSelectedReport(report.key)}
                            >
                                {report.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4">
                {renderReport()}
            </main>
        </div>
    )
}

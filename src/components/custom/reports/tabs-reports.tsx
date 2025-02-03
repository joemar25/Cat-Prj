"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BirthReport } from "./birth-report"
import { DeathReport } from "./death-report"
import { MarriageReport } from "./marriage-report"

export const TabsReports = () => {
    return (
        <div>
            <Tabs defaultValue="registry-reports"> 
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="registry-reports">Overall Reports</TabsTrigger>
                    <TabsTrigger value="marriage-reports">Marriage Reports</TabsTrigger>
                    <TabsTrigger value="live-birth">Birth Reports</TabsTrigger>
                    <TabsTrigger value="death-reports">Death Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="registry-reports">
                    <MarriageReport />
                    <BirthReport />
                    <DeathReport />
                </TabsContent>
                <TabsContent value="marriage-reports">
                    <MarriageReport />
                </TabsContent>
                <TabsContent value="live-birth">
                    <BirthReport />
                </TabsContent>
                <TabsContent value="death-reports">
                    <DeathReport />
                </TabsContent>
            </Tabs>
        </div>
    )
}
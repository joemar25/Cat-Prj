"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RecentRegistration {
    id: string
    name: string
    type: string
    registrationDate: string
}

interface RecentRegistrationsTableProps {
    recentRegistrations: RecentRegistration[]
}

export const RecentRegistrationsTable: React.FC<RecentRegistrationsTableProps> = ({ recentRegistrations }) => {
    return (
        <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>Recent Registrations</CardTitle>
                    <CardDescription>Last 10 days</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Registration Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentRegistrations.map((registration) => (
                                <TableRow key={registration.id}>
                                    <TableCell className="font-medium">{registration.name}</TableCell>
                                    <TableCell>{registration.type}</TableCell>
                                    <TableCell>{registration.registrationDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div>
                    Total: {recentRegistrations.length}
                </div>
                <div>Updated: {new Date().toLocaleDateString()}</div>
            </CardFooter>
        </Card>
    )
}
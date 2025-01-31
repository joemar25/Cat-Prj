"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

    return (
        <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
            <CardHeader className="flex items-center justify-between">
                <div>
                    <CardTitle>{t('recent_registrations')}</CardTitle>
                    <CardDescription>{t('last_10_days')}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('name')}</TableHead>
                                <TableHead>{t('type')}</TableHead>
                                <TableHead>{t('registration_date')}</TableHead>
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
                    {t('total')}: {recentRegistrations.length}
                </div>
                <div>{t('updated')}: {new Date().toLocaleDateString()}</div>
            </CardFooter>
        </Card>
    )
}

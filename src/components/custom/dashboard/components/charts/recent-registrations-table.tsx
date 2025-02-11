"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from 'react-i18next'
import { Skeleton } from "@/components/ui/skeleton"

interface RecentRegistration {
    id: string
    name: string
    type: string
    registrationDate: string
}

interface RecentRegistrationsTableProps {
    recentRegistrations: RecentRegistration[]
    isLoading?: boolean  // Add this prop
}

export const RecentRegistrationsTable: React.FC<RecentRegistrationsTableProps> = ({ recentRegistrations, isLoading = false }) => {
    const { t } = useTranslation()

    if (isLoading) {
        return (
            <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" /> {/* Title Skeleton */}
                    <Skeleton className="h-4 w-1/4" /> {/* Description Skeleton */}
                </CardHeader>
                <CardContent className="flex-1">
                    {[1, 2, 3, 4, 5].map(index => (
                        <Skeleton key={index} className="h-12 w-full mb-2" />
                    ))}
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <Skeleton className="h-4 w-1/4" /> {/* Total Skeleton */}
                    <Skeleton className="h-4 w-1/3" /> {/* Updated Date Skeleton */}
                </CardFooter>
            </Card>
        )
    }

    if (recentRegistrations.length === 0) {
        return (
            <Card className="lg:col-span-2 flex flex-col min-h-[400px]">
                <CardHeader>
                    <CardTitle>{t('recent_registrations')}</CardTitle>
                    <CardDescription>{t('last_10_days')}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center text-muted-foreground">
                    {t('no_recent_registrations')}
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div>{t('total')}: 0</div>
                    <div>{t('updated')}: {new Date().toLocaleDateString()}</div>
                </CardFooter>
            </Card>
        )
    }

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
                <div>{t('total')}: {recentRegistrations.length}</div>
                <div>{t('updated')}: {new Date().toLocaleDateString()}</div>
            </CardFooter>
        </Card>
    )
}

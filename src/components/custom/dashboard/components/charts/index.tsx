"use client"

import { Icons } from "@/components/ui/icons"
import { useEffect, useMemo, useState } from "react"
import { getBirthGenderCount, getRecentRegistrations } from "@/hooks/count-metrics"
import { GenderDistributionChart } from "@/components/custom/dashboard/components/charts/gender-distribution-chart"
import { RecentRegistrationsTable } from "@/components/custom/dashboard/components/charts/recent-registrations-table"

interface GenderCountData {
    name: string
    male: number
    female: number
}

interface BaseRegistration {
    name: string
    sex: string
    dateOfBirth: string
    registrationDate: string
}

interface RecentRegistration extends BaseRegistration {
    id: string
    type: string
}

const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

const calculateTotalsByGender = (data: GenderCountData[]) => {
    return data.reduce(
        (acc, item) => ({
            male: acc.male + item.male,
            female: acc.female + item.female,
        }),
        { male: 0, female: 0 }
    )
}

const filterRecentRegistrations = (registrations: BaseRegistration[]): RecentRegistration[] => {
    const tenDaysAgo = Date.now() - TEN_DAYS
    return registrations
        .filter(reg => new Date(reg.registrationDate).getTime() >= tenDaysAgo)
        .map((registration, index) => ({
            ...registration,
            id: `registration-${index}`,
            type: "Birth",
        }))
}

export default function ChartsDashboard() {
    const [chartData, setChartData] = useState<GenderCountData[]>([])
    const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { male: totalMale, female: totalFemale } = useMemo(
        () => calculateTotalsByGender(chartData),
        [chartData]
    )

    const totalRegistrations = totalMale + totalFemale

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genderCountData, recentRegistrationsData] = await Promise.all([
                    getBirthGenderCount(),
                    getRecentRegistrations()
                ])

                setChartData(genderCountData)
                setRecentRegistrations(filterRecentRegistrations(recentRegistrationsData))
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="grid gap-6 lg:grid-cols-5">
            <GenderDistributionChart
                totalMale={totalMale}
                totalFemale={totalFemale}
                totalRegistrations={totalRegistrations}
            />
            <RecentRegistrationsTable recentRegistrations={recentRegistrations} />
        </div>
    )
}
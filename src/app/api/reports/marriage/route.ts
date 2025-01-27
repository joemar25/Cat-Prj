// src/app/api/reports/marriage/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MarriageDataSchema } from '@/app/(dashboard)/reports/schemas/reports-schema'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const startYear = parseInt(searchParams.get('startYear') || '2019')
        const endYear = parseInt(searchParams.get('endYear') || '2025')

        const marriageData = await prisma.marriageCertificateForm.findMany({
            where: {
                dateOfMarriage: {
                    gte: new Date(`${startYear}-01-01`),
                    lte: new Date(`${endYear}-12-31`),
                },
            },
            select: {
                dateOfMarriage: true,
                husbandResidence: true,
                wifeResidence: true,
            },
        })

        const yearlyData: Record<number, { totalMarriages: number; residents: number; nonResidents: number }> = {}

        marriageData.forEach(entry => {
            const year = entry.dateOfMarriage.getFullYear()
            if (!yearlyData[year]) {
                yearlyData[year] = { totalMarriages: 0, residents: 0, nonResidents: 0 }
            }

            yearlyData[year].totalMarriages++
            if (entry.husbandResidence === 'RESIDENT' && entry.wifeResidence === 'RESIDENT') {
                yearlyData[year].residents++
            } else {
                yearlyData[year].nonResidents++
            }
        })

        const result = Object.entries(yearlyData)
            .map(([year, data]) => ({
                year: parseInt(year),
                ...data
            }))
            .sort((a, b) => a.year - b.year)

        const validatedData = MarriageDataSchema.parse(result)
        return NextResponse.json(validatedData)
    } catch (error) {
        // console.error('Error fetching marriage data:', error)
        return NextResponse.json({ error: 'Failed to fetch marriage data: ' + error }, { status: 500 })
    }
}
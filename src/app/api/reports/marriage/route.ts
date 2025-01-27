// src/app/api/reports/marriage/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { MarriageDataSchema } from '@/lib/types/reports'

const extractCountry = (residence: string | null) => {
    if (!residence) return null
    const matches = residence.match(/, ([^,]+)$/)
    return matches ? matches[1].trim() : null
}

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

        marriageData.forEach((entry) => {
            const year = entry.dateOfMarriage.getFullYear()
            if (!yearlyData[year]) {
                yearlyData[year] = { totalMarriages: 0, residents: 0, nonResidents: 0 }
            }

            yearlyData[year].totalMarriages++

            const husbandCountry = extractCountry(entry.husbandResidence)
            const wifeCountry = extractCountry(entry.wifeResidence)

            if (husbandCountry === 'Philippines' && wifeCountry === 'Philippines') {
                yearlyData[year].residents++
            } else {
                yearlyData[year].nonResidents++
            }
        })

        const result = Object.entries(yearlyData).map(([year, data]) => ({
            year: parseInt(year),
            totalMarriages: data.totalMarriages,
            residents: data.residents,
            nonResidents: data.nonResidents,
        }))

        const validatedData = MarriageDataSchema.parse(result)
        return NextResponse.json(validatedData)
    } catch (error) {
        console.error('Error fetching marriage data:', error)
        return NextResponse.json({ error: 'Failed to fetch marriage data' }, { status: 500 })
    }
}
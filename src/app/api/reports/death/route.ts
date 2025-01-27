// src/app/api/reports/death/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { DeathDataSchema } from '@/lib/types/reports'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const startYear = parseInt(searchParams.get('startYear') || '2019')
        const endYear = parseInt(searchParams.get('endYear') || '2025')

        const allDeaths = await prisma.deathCertificateForm.findMany({
            where: {
                dateOfDeath: {
                    gte: new Date(`${startYear}-01-01`),
                    lte: new Date(`${endYear}-12-31`),
                },
            },
            select: {
                dateOfDeath: true,
                sex: true,
            },
        })

        // Process data year by year
        const yearlyData: Record<number, { male: number; female: number }> = {}

        allDeaths.forEach(death => {
            const year = death.dateOfDeath.getFullYear()

            if (!yearlyData[year]) {
                yearlyData[year] = { male: 0, female: 0 }
            }

            if (death.sex.toLowerCase() === 'male') {
                yearlyData[year].male++
            } else if (death.sex.toLowerCase() === 'female') {
                yearlyData[year].female++
            }
        })

        // Convert to array format
        const result = Object.entries(yearlyData)
            .map(([year, counts]) => ({
                year: parseInt(year),
                male: counts.male,
                female: counts.female
            }))
            .sort((a, b) => a.year - b.year)

        const validatedData = DeathDataSchema.parse(result)
        return NextResponse.json(validatedData)
    } catch (error) {
        // console.error('Error fetching death data:', error)
        return NextResponse.json({ error: 'Failed to fetch death data: ' + error }, { status: 500 })
    }
}
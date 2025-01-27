// src/app/api/reports/birth/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { BirthDataSchema } from '@/lib/types/reports'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const startYear = parseInt(searchParams.get('startYear') || '2019')
        const endYear = parseInt(searchParams.get('endYear') || '2025')

        const allBirths = await prisma.birthCertificateForm.findMany({
            where: {
                dateOfBirth: {
                    gte: new Date(`${startYear}-01-01`),
                    lte: new Date(`${endYear}-12-31`),
                },
            },
            select: {
                dateOfBirth: true,
                sex: true,
            },
        })

        const yearlyData: Record<number, { male: number; female: number }> = {}

        allBirths.forEach(birth => {
            const year = birth.dateOfBirth.getFullYear()

            if (!yearlyData[year]) {
                yearlyData[year] = { male: 0, female: 0 }
            }

            if (birth.sex.toLowerCase() === 'male') {
                yearlyData[year].male++
            } else if (birth.sex.toLowerCase() === 'female') {
                yearlyData[year].female++
            }
        })

        const result = Object.entries(yearlyData)
            .map(([year, counts]) => ({
                year: parseInt(year),
                male: counts.male,
                female: counts.female
            }))
            .sort((a, b) => a.year - b.year)

        const validatedData = BirthDataSchema.parse(result)
        return NextResponse.json(validatedData)
    } catch (error) {
        // console.error('Error fetching birth data:', error)
        return NextResponse.json({ error: 'Failed to fetch birth data: ' + error }, { status: 500 })
    }
}
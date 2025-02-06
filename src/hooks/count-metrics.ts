"use server"

import { prisma } from "@/lib/prisma"
import { FormType } from "@prisma/client"

interface MonthlyCount {
  month: string
  birth: number
  death: number
  marriage: number
}

interface RegistryMetrics {
  monthlyData: MonthlyCount[]
  trend: {
    percentage: string
    isUp: boolean
  }
}

interface BaseRegistration {
  name: string
  sex: string
  dateOfBirth: string
  registrationDate: string
  formType: FormType
}

export async function getRegistryMetrics(): Promise<RegistryMetrics> {
  const today = new Date()
  const last6Months = Array.from({ length: 6 }, (_, i) =>
    new Date(today.getFullYear(), today.getMonth() - i, 1)
  ).reverse()

  const registryForms = await prisma.baseRegistryForm.findMany({
    where: {
      dateOfRegistration: {
        gte: last6Months[0],
        lte: new Date(today.getFullYear(), today.getMonth() + 1, 0)
      }
    },
    select: { formType: true, dateOfRegistration: true }
  })

  const monthlyData = last6Months.map(month => {
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const monthCounts: MonthlyCount = {
      month: month.toLocaleString('default', { month: 'long' }),
      birth: 0,
      death: 0,
      marriage: 0
    }

    registryForms.forEach(form => {
      if (form.dateOfRegistration >= monthStart && form.dateOfRegistration <= monthEnd) {
        switch (form.formType) {
          case 'BIRTH': monthCounts.birth++; break
          case 'DEATH': monthCounts.death++; break
          case 'MARRIAGE': monthCounts.marriage++; break
        }
      }
    })

    return monthCounts
  })

  const [currentMonth, previousMonth] = [monthlyData.at(-1)!, monthlyData.at(-2)!]
  const currentTotal = currentMonth.birth + currentMonth.death + currentMonth.marriage
  const previousTotal = previousMonth.birth + previousMonth.death + previousMonth.marriage
  const percentageChange = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  return {
    monthlyData,
    trend: {
      percentage: Math.abs(percentageChange).toFixed(1),
      isUp: percentageChange >= 0
    }
  }
}

export async function getRecentRegistrations(): Promise<BaseRegistration[]> {
  const registrations = await prisma.baseRegistryForm.findMany({
    include: {
      birthCertificateForm: true,
      deathCertificateForm: true,
      marriageCertificateForm: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return registrations.map(reg => {
    const registration: BaseRegistration = {
      name: '',
      sex: '',
      dateOfBirth: '',
      registrationDate: reg.createdAt.toISOString().split('T')[0],
      formType: reg.formType
    }

    if (reg.birthCertificateForm) {
      const childName = reg.birthCertificateForm.childName as { first: string; middle?: string; last: string }
      registration.name = `${childName.last}, ${childName.first} ${childName.middle || ''}`.trim()
      registration.sex = reg.birthCertificateForm.sex
      registration.dateOfBirth = reg.birthCertificateForm.dateOfBirth.toISOString().split('T')[0]
    } else if (reg.deathCertificateForm) {
      const deceasedName = reg.deathCertificateForm.deceasedName as { first: string; middle?: string; last: string }
      registration.name = `${deceasedName.last}, ${deceasedName.first} ${deceasedName.middle || ''}`.trim()
      registration.sex = reg.deathCertificateForm.sex
      registration.dateOfBirth = reg.deathCertificateForm.dateOfBirth?.toISOString().split('T')[0] || ''
    } else if (reg.marriageCertificateForm) {
      registration.name = `${reg.marriageCertificateForm.husbandLastName}, ${reg.marriageCertificateForm.husbandFirstName} & ${reg.marriageCertificateForm.wifeLastName}, ${reg.marriageCertificateForm.wifeFirstName}`
      registration.sex = 'N/A'
      registration.dateOfBirth = reg.marriageCertificateForm.dateOfMarriage.toISOString().split('T')[0]
    }

    return registration
  })
}

interface GenderCount {
  male: number
  female: number
}

interface GenderData {
  name: string
  male: number
  female: number
}

export type PrismaModels = "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm"

export async function getCurrentMonthRegistrations(model: PrismaModels): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  if (model === "baseRegistryForm") {
    return prisma.baseRegistryForm.count({
      where: { dateOfRegistration: { gte: startOfMonth, lte: endOfMonth } }
    })
  }

  const relationField = {
    birthCertificateForm: { birthCertificateForm: { isNot: null } },
    deathCertificateForm: { deathCertificateForm: { isNot: null } },
    marriageCertificateForm: { marriageCertificateForm: { isNot: null } }
  }[model]

  return prisma.baseRegistryForm.count({
    where: {
      dateOfRegistration: { gte: startOfMonth, lte: endOfMonth },
      ...relationField
    }
  })
}

export async function getPreviousMonthRegistrations(model: PrismaModels): Promise<number> {
  const now = new Date()
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  if (model === "baseRegistryForm") {
    return prisma.baseRegistryForm.count({
      where: { dateOfRegistration: { gte: startOfPrevMonth, lte: endOfPrevMonth } }
    })
  }

  const relationField = {
    birthCertificateForm: { birthCertificateForm: { isNot: null } },
    deathCertificateForm: { deathCertificateForm: { isNot: null } },
    marriageCertificateForm: { marriageCertificateForm: { isNot: null } }
  }[model]

  return prisma.baseRegistryForm.count({
    where: {
      dateOfRegistration: { gte: startOfPrevMonth, lte: endOfPrevMonth },
      ...relationField
    }
  })
}

export async function getBirthAndDeathGenderCount(type: "birth" | "death"): Promise<GenderData[]> {
  const birthResults = await prisma.birthCertificateForm.findMany({
      select: {
          sex: true,
          baseForm: { select: { createdAt: true } }
      },
  })

  const deathResults = await prisma.deathCertificateForm.findMany({
      select: {
          sex: true,
          baseForm: { select: { createdAt: true } }
      },
  })

  const groupedData = new Map<string, GenderCount>()

  const processResults = (results: typeof birthResults) => {
      results.forEach(record => {
          if (!record.baseForm?.createdAt) return

          const date = record.baseForm.createdAt.toISOString().split('T')[0]
          const gender = record.sex.toLowerCase()

          if (!groupedData.has(date)) {
              groupedData.set(date, { male: 0, female: 0 })
          }

          const count = groupedData.get(date)!
          if (gender === 'male' || gender === 'female') {
              count[gender]++
          }
      })
  }

  // Fetch only birth or death gender counts based on selection
  if (type === "birth") {
      processResults(birthResults)
  } else {
      processResults(deathResults)
  }

  return Array.from(groupedData.entries())
      .map(([date, counts]): GenderData => ({
          name: date,
          male: counts.male,
          female: counts.female
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
}

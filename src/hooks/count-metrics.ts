"use server";

import { prisma } from "@/lib/prisma";

export async function getRegistryMetrics() {
  try {
    const today = new Date()
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      return new Date(today.getFullYear(), today.getMonth() - i, 1)
    }).reverse()

    const startDate = last6Months[0]
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Fetch all registry forms for the period
    const registryForms = await prisma.baseRegistryForm.findMany({
      where: {
        dateOfRegistration: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        formType: true,
        dateOfRegistration: true
      }
    })

    // Process the data into monthly counts
    const monthlyData = last6Months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

      const monthCounts = {
        month: month.toLocaleString('default', { month: 'long' }),
        birth: 0,
        death: 0,
        marriage: 0
      }

      registryForms.forEach(form => {
        if (form.dateOfRegistration >= monthStart && form.dateOfRegistration <= monthEnd) {
          switch (form.formType) {
            case 'BIRTH':
              monthCounts.birth++
              break
            case 'DEATH':
              monthCounts.death++
              break
            case 'MARRIAGE':
              monthCounts.marriage++
              break
          }
        }
      })

      return monthCounts
    })

    // Calculate trends
    const currentMonth = monthlyData[monthlyData.length - 1]
    const previousMonth = monthlyData[monthlyData.length - 2]
    
    const currentTotal = currentMonth.birth + currentMonth.death + currentMonth.marriage
    const previousTotal = previousMonth.birth + previousMonth.death + previousMonth.marriage
    
    const percentageChange = previousTotal !== 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0

    return {
      monthlyData,
      trend: {
        percentage: Math.abs(percentageChange).toFixed(1),
        isUp: percentageChange >= 0
      }
    }
  } catch (error) {
    console.error('Error fetching registry metrics:', error)
    throw new Error('Failed to fetch registry metrics')
  }
}



export async function getBirthGenderCount() {
  const results = await prisma.birthCertificateForm.findMany({
    select: {
      sex: true,
      baseForm: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  const groupedData: Record<string, { male: number; female: number }> = {};

  results.forEach((record) => {
    const date = record.baseForm?.createdAt.toISOString().split("T")[0];
    const gender = record.sex.toLowerCase();

    if (!date) return;

    if (!groupedData[date]) {
      groupedData[date] = { male: 0, female: 0 };
    }

    if (gender === "male" || gender === "female") {
      groupedData[date][gender]++;
    }
  });

  return Object.entries(groupedData)
    .map(([date, counts]) => ({
      name: date,
      male: counts.male,
      female: counts.female,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRecentRegistrations() {
  const recentRegistrations = await prisma.birthCertificateForm.findMany({
    select: {
      childName: true,
      sex: true,
      dateOfBirth: true,
      baseForm: {
        select: {
          createdAt: true,
        },
      },
    },
    orderBy: {
      baseForm: {
        createdAt: "desc", // Sort by createdAt descending
      },
    },
    take: 100, // Limit to the top 100
  });

  return recentRegistrations.map((registration) => {
    const childName = registration.childName as {
      first: string;
      middle?: string;
      last: string;
    };

    return {
      name: `${childName.last}, ${childName.first} ${childName.middle || ""}`.trim(),
      sex: registration.sex,
      dateOfBirth: registration.dateOfBirth.toISOString().split("T")[0],
      registrationDate: registration.baseForm.createdAt.toISOString().split("T")[0],
    };
  });
}







/**
 * Supported Prisma models for dynamic queries.
 */
export type PrismaModels = "baseRegistryForm" | "birthCertificateForm" | "deathCertificateForm" | "marriageCertificateForm";

/**
 * Get the total count of records for a specific model.
 * @param model The Prisma model name.
 * @returns The total count.
 */
export async function getModelCount(model: PrismaModels): Promise<number> {
  if (model === "baseRegistryForm") {
    return await prisma.baseRegistryForm.count();
  }

  const relationField = {
    birthCertificateForm: { birthCertificateForm: { isNot: null } },
    deathCertificateForm: { deathCertificateForm: { isNot: null } },
    marriageCertificateForm: { marriageCertificateForm: { isNot: null } },
  }[model];

  return await prisma.baseRegistryForm.count({
    where: {
      ...relationField,
    },
  });
}


/**
 * Get the count of records created in the current month for a specific model.
 * @param model The Prisma model name.
 * @returns The count for the current month.
 */
export async function getCurrentMonthRegistrations(model: PrismaModels): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (model === "baseRegistryForm") {
    return await prisma.baseRegistryForm.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
  }

  const relationField = {
    birthCertificateForm: { birthCertificateForm: { isNot: null } },
    deathCertificateForm: { deathCertificateForm: { isNot: null } },
    marriageCertificateForm: { marriageCertificateForm: { isNot: null } },
  }[model];

  return await prisma.baseRegistryForm.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      ...relationField,
    },
  });
}

/**
 * Get the count of records created in the previous month for a specific model.
 * @param model The Prisma model name.
 * @returns The count for the previous month.
 */
export async function getPreviousMonthRegistrations(model: PrismaModels): Promise<number> {
  const now = new Date();
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  if (model === "baseRegistryForm") {
    return await prisma.baseRegistryForm.count({
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lte: endOfPreviousMonth,
        },
      },
    });
  }

  const relationField = {
    birthCertificateForm: { birthCertificateForm: { isNot: null } },
    deathCertificateForm: { deathCertificateForm: { isNot: null } },
    marriageCertificateForm: { marriageCertificateForm: { isNot: null } },
  }[model];

  return await prisma.baseRegistryForm.count({
    where: {
      createdAt: {
        gte: startOfPreviousMonth,
        lte: endOfPreviousMonth,
      },
      ...relationField,
    },
  });
}




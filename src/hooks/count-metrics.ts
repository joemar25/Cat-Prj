"use server";

import { prisma } from "@/lib/prisma";

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


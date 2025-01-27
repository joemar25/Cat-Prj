// src/app/(dashboard)/reports/schemas/reports-schema.ts
import { z } from 'zod'

export const BirthDataSchema = z.array(
    z.object({
        year: z.number(),
        male: z.number(),
        female: z.number(),
    })
)

export const DeathDataSchema = z.array(
    z.object({
        year: z.number(),
        male: z.number(),
        female: z.number(),
    })
)

export const MarriageDataSchema = z.array(
    z.object({
        year: z.number(),
        totalMarriages: z.number(),
        residents: z.number(),
        nonResidents: z.number(),
    })
)
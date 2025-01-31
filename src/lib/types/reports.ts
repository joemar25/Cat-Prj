// src/lib/types/reports.ts
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
        residents: z.number(), // Both partners are residents of the Philippines
        nonResidents: z.number(), // One or both partners are non-residents
    })
)

// Infer TypeScript types from Zod schemas
export type BirthData = z.infer<typeof BirthDataSchema>
export type DeathData = z.infer<typeof DeathDataSchema>
export type MarriageData = z.infer<typeof MarriageDataSchema>
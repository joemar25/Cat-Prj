// src\lib\types\roles.ts
import { z } from "zod"
import { Permission } from "@prisma/client"

export const createRoleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    permissions: z.array(z.nativeEnum(Permission))
})
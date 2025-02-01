// src/lib/validation/signUpSchema.ts
import { object, z } from 'zod'
import { getEmailSchema, getPasswordSchema, getNameSchema } from '@/lib/validation/shared'

/**
 * Creates a sign-up schema with a dynamic list of allowed role values.
 *
 * @param allowedRoles - an array of allowed role names
 */
export const createSignUpSchema = (allowedRoles: string[]) =>
    object({
        email: getEmailSchema(),
        password: getPasswordSchema('password'),
        confirmPassword: getPasswordSchema('confirmPassword'),
        name: getNameSchema(),
        // Validate that the provided role is one of the allowed ones.
        role: z
            .string()
            .refine((val) => allowedRoles.includes(val), {
                message: 'Invalid role selected',
            }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type SignUpForm = z.infer<ReturnType<typeof createSignUpSchema>>

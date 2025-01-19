import { object, z } from 'zod'
import { getEmailSchema, getPasswordSchema, getNameSchema } from '@/lib/validation/shared'

export const signUpSchema = object({
    email: getEmailSchema(),
    password: getPasswordSchema('password'),
    confirmPassword: getPasswordSchema('confirmPassword'),
    name: getNameSchema(),
    role: z.enum(['ADMIN', 'STAFF']).optional().default('STAFF'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

export type SignUpForm = z.infer<typeof signUpSchema>
import { object, z } from 'zod'
import { getEmailSchema, getPasswordSchema } from '@/lib/validation/shared'

export const signInSchema = object({
    email: getEmailSchema(),
    password: getPasswordSchema('password'),
})

export type SignInForm = z.infer<typeof signInSchema>
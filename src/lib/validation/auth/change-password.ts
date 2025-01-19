import { object, z } from 'zod'
import { getPasswordSchema } from '@/lib/validation/shared'

export const changePasswordSchema = object({
    currentPassword: getPasswordSchema('password'),
    newPassword: getPasswordSchema('password'),
    confirmNewPassword: getPasswordSchema('confirmPassword'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
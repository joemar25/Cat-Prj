import { z } from 'zod'
import { editProfileSchema } from '../profile/edit-profile'

export const editUserSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .transform((val) => val.trim()),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Please enter a valid email address')
        .min(5, 'Email is too short')
        .max(50, 'Email must not exceed 50 characters')
        .transform((val) => val.toLowerCase()),
})

export const editUserFormSchema = editUserSchema
    .merge(editProfileSchema)
    .extend({
        newPassword: z
            .string()
            .refine(
                (value) => !value || value.length >= 8,
                'Password must be at least 8 characters long'
            )
            .optional(),
        confirmNewPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword || data.confirmNewPassword) {
                return data.newPassword === data.confirmNewPassword
            }
            return true
        },
        {
            message: 'Passwords do not match',
            path: ['confirmNewPassword'],
        }
    )

export type EditUserSchema = z.infer<typeof editUserSchema>
export type EditUserFormData = z.infer<typeof editUserFormSchema>
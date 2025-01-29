// src\lib\validation\profile\edit-profile.ts
import { z } from 'zod'

export const editProfileSchema = z.object({
    dateOfBirth: z
        .string()
        .optional()
        .nullable()
        .refine(
            (date) => !date || new Date(date) <= new Date(),
            'Date of birth cannot be in the future'
        ),
    phoneNumber: z
        .string()
        .optional()
        .nullable()
        .refine(
            (phone) =>
                !phone ||
                /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone),
            'Please enter a valid phone number'
        ),
    address: z.string().optional().nullable().transform((val) => val?.trim()),
    city: z.string().optional().nullable().transform((val) => val?.trim()),
    state: z.string().optional().nullable().transform((val) => val?.trim()),
    country: z.string().optional().nullable().transform((val) => val?.trim()),
    postalCode: z
        .string()
        .optional()
        .nullable()
        .refine(
            (postal) => !postal || /^[0-9]{4}$/.test(postal),
            'Please enter a valid Philippine postal code (4 digits).'
        ),
    bio: z
        .string()
        .optional()
        .nullable()
        .transform((val) => val?.trim())
        .refine((bio) => !bio || bio.length <= 500, 'Bio must not exceed 500 characters'),
    occupation: z.string().optional().nullable().transform((val) => val?.trim()),
    gender: z
        .enum(['male', 'female', 'other'], {
            errorMap: () => ({ message: 'Please select a valid gender' }),
        })
        .optional()
        .nullable(),
    nationality: z.string().optional().nullable().transform((val) => val?.trim()),
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>
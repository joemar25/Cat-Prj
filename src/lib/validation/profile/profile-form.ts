// src/lib/validation/profile/profile-form.ts
import { z } from 'zod'

export const profileFormSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, and _.-')
        .optional(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    dateOfBirth: z.string().optional().nullable(),
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
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
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
        .refine((bio) => !bio || bio.length <= 500, 'Bio must not exceed 500 characters'),
    occupation: z.string().optional().nullable(),
    gender: z.enum(['male', 'female', 'other']).optional().nullable(),
    nationality: z.string().optional().nullable()
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
import { z } from 'zod'

export const profileFormSchema = z.object({
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (phone) =>
                !phone ||
                /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone),
            'Please enter a valid phone number'
        ),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z
        .string()
        .optional()
        .refine(
            (postal) => !postal || /^[0-9]{4}$/.test(postal),
            'Please enter a valid Philippine postal code (4 digits).'
        ),
    bio: z
        .string()
        .optional()
        .refine((bio) => !bio || bio.length <= 500, 'Bio must not exceed 500 characters'),
    occupation: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    nationality: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
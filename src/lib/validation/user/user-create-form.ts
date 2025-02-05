import * as z from 'zod'

export const userCreateFormSchema = z.object({
    username: z.string().min(3).max(50).optional(),
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/),
    confirmPassword: z.string(),
    roleId: z.string().min(1, "Role is required"),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    nationality: z.string().optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type UserCreateFormValues = z.infer<typeof userCreateFormSchema>
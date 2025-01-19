import { string } from 'zod'

export const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
    string({ required_error: `${type} is required` })
        .max(32, 'Password must be less than 32 characters')
        .refine(
            (value) => !value || value.length >= 8,
            'Password must be at least 8 characters long'
        )

export const getEmailSchema = () =>
    string({ required_error: `Email is required` })
        .email('Invalid email address')
        .min(1, 'Email must be at least 1 character long')
        .max(32, 'Email must be less than 32 characters')

export const getNameSchema = () =>
    string({ required_error: `Name is required` })
        .min(1, 'Name must be at least 1 character long')
        .max(32, 'Name must be less than 32 characters')
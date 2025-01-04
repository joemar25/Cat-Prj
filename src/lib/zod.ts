// src\lib\zod.ts
import { object, string, z } from 'zod';

// Helper functions for schema validation
const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} is required` })
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be less than 32 characters');

const getEmailSchema = () =>
  string({ required_error: `Email is required` })
    .email('Invalid email address')
    .min(1, 'Email must be at least 1 character long')
    .max(32, 'Email must be less than 32 characters');

const getNameSchema = () =>
  string({ required_error: `Name is required` })
    .min(1, 'Name must be at least 1 character long')
    .max(32, 'Name must be less than 32 characters');

// Sign-up schema
export const signUpSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
  name: getNameSchema(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Sign-in schema
export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
});

// Registration schema with profile and attachment
export const registrationSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    occupation: z.string().optional().nullable(),
    gender: z.enum(['male', 'female', 'other']).optional().nullable(),
    nationality: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Type inference for forms
export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
export type RegistrationForm = z.infer<typeof registrationSchema>;

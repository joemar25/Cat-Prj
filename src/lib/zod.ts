// src\lib\zod.ts
import { object, string, z } from 'zod';

export const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} is required` })
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be less than 32 characters');

export const getEmailSchema = () =>
  string({ required_error: `Email is required` })
    .email('Invalid email address')
    .min(1, 'Email must be at least 1 character long')
    .max(32, 'Email must be less than 32 characters');

export const getNameSchema = () =>
  string({ required_error: `Name is required` })
    .min(1, 'Name must be at least 1 character long')
    .max(32, 'Name must be less than 32 characters');

// Sign-up schema using literal types for role
export const signUpSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
  name: getNameSchema(),
  role: z.enum(['ADMIN', 'STAFF']).optional().default('STAFF'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
});

// Registration schema with profile and attachment
export const registrationForm = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    dateOfBirth: z.string(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    occupation: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    nationality: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const certifiedCopySchema = z.object({
  lcrNo: z.string().min(1, 'LCR number is required'),
  bookNo: z.string().min(1, 'Book number is required'),
  pageNo: z.string().min(1, 'Page number is required'),
  searchedBy: z.string().min(1, 'Searcher name is required'),
  contactNo: z.string().min(1, 'Contact number is required'),
  date: z.string().min(1, 'Date is required'),
});

export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
export type RegistrationForm = z.infer<typeof registrationForm>;
export type CertifiedCopyFormData = z.infer<typeof certifiedCopySchema>;

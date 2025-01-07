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

// ------------- Update/Edit -----------//
// Basic schema for user edit
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
});

// Schema for profile edit
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
  address: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
  city: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
  state: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
  country: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
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
    .refine(
      (bio) => !bio || bio.length <= 500,
      'Bio must not exceed 500 characters'
    ),
  occupation: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
  gender: z
    .enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Please select a valid gender' }),
    })
    .optional()
    .nullable(),
  nationality: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim()),
});

// Combined schema for the edit form
export const editUserFormSchema = editUserSchema.merge(editProfileSchema);

// Export types
export type EditUserSchema = z.infer<typeof editUserSchema>;
export type EditProfileSchema = z.infer<typeof editProfileSchema>;
export type EditUserFormData = z.infer<typeof editUserFormSchema>;

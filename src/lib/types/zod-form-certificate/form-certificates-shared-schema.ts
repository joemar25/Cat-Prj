import {
  formatDateTime,
  parseToDate,
  type DateFormatOptions,
} from '@/utils/date';
import { z } from 'zod';

interface DateSchemaOptions {
  minYear?: number;
  allowFuture?: boolean;
  customMessage?: string;
  formatOptions?: DateFormatOptions;
}

export const createDateSchema = (options: DateSchemaOptions = {}) => {
  const { minYear = 1900, allowFuture = false, customMessage } = options;

  return z.string().refine(
    (value) => {
      // Handle empty string if the field is optional
      if (!value) return true;

      // Validate MM/DD/YYYY format
      if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return false;

      const [month, day, year] = value.split('/').map(Number);
      const date = parseToDate(year, month, day);

      if (!date) return false;

      const now = new Date();

      // Year range check
      const isValidYear = year >= minYear && (allowFuture || date <= now);

      return isValidYear;
    },
    {
      message:
        customMessage ||
        `Please enter a valid date in MM/DD/YYYY format${
          !allowFuture ? ' (past or today only)' : ''
        }`,
    }
  );
};

// Pre-configured schemas for common use cases
// export const dateSchema = {
//   past: createDateSchema({
//     allowFuture: false,
//     formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
//   }),

//   any: createDateSchema({
//     allowFuture: true,
//     formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
//   }),

//   birthDate: createDateSchema({
//     minYear: 1900,
//     allowFuture: false,
//     customMessage: 'Please enter a valid birth date in MM/DD/YYYY format',
//     formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
//   }),

//   documentDate: createDateSchema({
//     minYear: 1900,
//     allowFuture: false,
//     customMessage: 'Please enter a valid document date in MM/DD/YYYY format',
//     formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
//   }),
// };

// Helper function for form date string to Date object conversion
export const parseFormDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  const [month, day, year] = dateString.split('/').map(Number);
  const date = parseToDate(year, month, day);
  return date || undefined;
};

// Helper function for Date object to form string conversion
export const formatFormDate = (
  date: Date | undefined,
  options?: DateFormatOptions
): string => {
  if (!date) return '';

  // Use formatDateTime with specific format for form fields
  const defaultFormatOptions: DateFormatOptions = {
    monthFormat: '2-digit',
    dayFormat: '2-digit',
    yearFormat: 'numeric',
    locale: 'en-US',
  };

  const formattedDate = formatDateTime(date, {
    ...defaultFormatOptions,
    ...options,
  });

  // Ensure MM/DD/YYYY format
  const [month, day, year] = formattedDate.split('/');
  return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
};

// ------------------------------------------//

// shared-schema.ts

// Helper schemas
export const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
});

export const placeOfBirthSchema = z.object({
  province: z.string().min(1, 'Province is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  specificAddress: z.string().optional(),
});

export const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(
    (value) => {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
      const [month, day, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date.getFullYear() === year &&
        date <= new Date()
      );
    },
    {
      message: 'Please enter a valid date in MM/DD/YYYY format.',
    }
  );

export const timeSchema = z
  .string()
  .min(1, 'Time is required')
  .refine((value) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
    message: 'Please enter a valid time in HH:MM format (e.g., 14:30).',
  });

export const registryNumberSchema = z
  .string()
  .regex(
    /^\d{4}-\d+$/, // Enforces YYYY- followed by one or more digits
    'Registry number must be in the format: YYYY-numbers (e.g., 2025-123456).'
  )
  .refine(
    (value) => {
      const year = parseInt(value.split('-')[0]);
      const currentYear = new Date().getFullYear();
      return year >= 1945 && year <= currentYear;
    },
    {
      message: 'The year must be between 1945 and the current year.',
    }
  )
  .refine(
    (value) => {
      const sequenceNumber = parseInt(value.split('-')[1]);
      return sequenceNumber > 0; // Enforce positive numbers only
    },
    {
      message: 'The sequence number must be a positive number.',
    }
  );

export const provinceSchema = z
  .string()
  .min(1, 'Please select a province.')
  .max(100, 'Province name is too long.');

export const cityMunicipalitySchema = z
  .string()
  .min(1, 'Please select a city or municipality.')
  .max(100, 'City/Municipality name is too long.');

export const signatureSchema = z.object({
  signature: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  date: dateSchema,
});

export const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  cityMunicipality: z.string().min(1, 'City/Municipality is required'),
  province: z.string().min(1, 'Province is required'),
  country: z.string().min(1, 'Country is required'),
});

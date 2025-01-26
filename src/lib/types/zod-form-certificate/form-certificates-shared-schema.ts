import { parseToDate, type DateFormatOptions } from '@/utils/date';
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

// Helper function for form date string to Date object conversion
export const parseFormDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  const [month, day, year] = dateString.split('/').map(Number);
  const date = parseToDate(year, month, day);
  return date || undefined;
};

export const parseTimeStringToDate = (timeString: string): Date | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds
  return date;
};

// ------------------------------------------//

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
  .date({
    required_error: 'Date is required',
    invalid_type_error: 'Please provide a valid date',
  })
  .nullable()
  .refine((val) => val !== null, {
    message: 'Date is required',
  });

export const timeSchema = z
  .date({
    required_error: 'Time is required',
    invalid_type_error: 'Please provide a valid time',
  })
  .nullable()
  .refine((val) => val !== null, {
    message: 'Time is required',
  })
  .refine(
    (val) => {
      if (!val) return false;
      const hours = val.getHours();
      const minutes = val.getMinutes();
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    },
    {
      message: 'Please provide a valid time in HH:MM format (e.g., 14:30).',
    }
  );

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

export type WithNullableDates<T> = {
  [P in keyof T]: T[P] extends Date
    ? Date | null
    : T[P] extends object
    ? WithNullableDates<T[P]>
    : T[P];
};

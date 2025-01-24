// schemas/date-schema.ts
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
export const dateSchema = {
  past: createDateSchema({
    allowFuture: false,
    formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
  }),

  any: createDateSchema({
    allowFuture: true,
    formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
  }),

  birthDate: createDateSchema({
    minYear: 1900,
    allowFuture: false,
    customMessage: 'Please enter a valid birth date in MM/DD/YYYY format',
    formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
  }),

  documentDate: createDateSchema({
    minYear: 1900,
    allowFuture: false,
    customMessage: 'Please enter a valid document date in MM/DD/YYYY format',
    formatOptions: { monthFormat: '2-digit', dayFormat: '2-digit' },
  }),
};

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

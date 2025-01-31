import { FormType } from '@prisma/client';

export function isValidDate(date: unknown, formType: FormType): boolean {
  switch (formType) {
    case FormType.BIRTH:
    // Birth certificate expects {year, month, day} format
    case FormType.BIRTH:
      if (
        typeof date === 'object' &&
        date !== null &&
        'year' in date &&
        'month' in date &&
        'day' in date
      ) {
        const { year, month, day } = date as {
          year: string | number;
          month: string | number;
          day: string | number;
        };

        const yearNum = parseInt(year.toString());
        const monthNum = parseInt(month.toString());
        const dayNum = parseInt(day.toString());

        // Validate ranges for year, month, and day
        if (
          yearNum >= 1945 &&
          yearNum <= new Date().getFullYear() && // Year should be valid
          monthNum >= 1 &&
          monthNum <= 12 && // Month should be 1-12
          dayNum >= 1 &&
          dayNum <= 31 // Day should be valid
        ) {
          const constructedDate = new Date(`${yearNum}-${monthNum}-${dayNum}`);
          return !isNaN(constructedDate.getTime());
        }
      }
      return false;

    case FormType.DEATH:
      // Death certificate expects Date object
      if (date instanceof Date) {
        return !isNaN(date.getTime());
      }
      return false;

    case FormType.MARRIAGE:
      // Marriage certificate also expects Date object like death certificate
      if (date instanceof Date) {
        const currentDate = new Date();
        // Additional marriage-specific validations:
        // 1. Date should not be in the future
        if (date > currentDate) {
          return false;
        }
        // 2. Date should not be before 1945 (matching our registry number validation)
        const minDate = new Date('1945-01-01');
        if (date < minDate) {
          return false;
        }
        return !isNaN(date.getTime());
      }
      return false;

    default:
      return false;
  }
}

// src/utils/date.ts
// Define the format options as a type
export type DateFormatOptions = {
  showTime?: boolean; // Whether to show time
  monthFormat?: 'short' | 'long' | 'numeric' | '2-digit'; // How to display the month
  yearFormat?: 'numeric' | '2-digit'; // How to display the year
  dayFormat?: 'numeric' | '2-digit'; // How to display the day
  hourFormat?: '2-digit' | 'numeric'; // How to display hours
  minuteFormat?: '2-digit' | 'numeric'; // How to display minutes
  locale?: string; // Locale for formatting (defaults to 'en-US')
};

// Default options
const defaultOptions: DateFormatOptions = {
  showTime: false,
  monthFormat: 'short',
  yearFormat: 'numeric',
  dayFormat: 'numeric',
  hourFormat: '2-digit',
  minuteFormat: '2-digit',
  locale: 'en-US',
};

export function formatDateTime(
  date: string | Date,
  options?: DateFormatOptions
): string {
  const parsedDate = date instanceof Date ? date : new Date(date);
  const formatOptions = { ...defaultOptions, ...options };

  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    month: formatOptions.monthFormat,
    day: formatOptions.dayFormat,
    year: formatOptions.yearFormat,
  };

  // Only add time options if showTime is true
  if (formatOptions.showTime) {
    dateTimeFormatOptions.hour = formatOptions.hourFormat;
    dateTimeFormatOptions.minute = formatOptions.minuteFormat;
  }

  return new Intl.DateTimeFormat(
    formatOptions.locale,
    dateTimeFormatOptions
  ).format(parsedDate);
}

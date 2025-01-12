interface YearOption {
  value: string;
  label: string;
}

/**
 * Gets the current year
 * @returns Current year as number
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Generates an array of year options from current year to 1900
 * @param startYear Optional - Starting year (defaults to current year)
 * @param endYear Optional - Ending year (defaults to 1900)
 * @returns Array of year options with value and label
 */
export const generateYearOptions = (
  startYear: number = getCurrentYear(),
  endYear: number = 1900
): YearOption[] => {
  const years: YearOption[] = [];
  for (let year = startYear; year >= endYear; year--) {
    years.push({
      value: year.toString(),
      label: year.toString(),
    });
  }
  return years;
};

/**
 * Pre-generated year options from current year to 1900
 */
export const yearOptions: YearOption[] = generateYearOptions();

/**
 * Gets the number of days in a given month and year
 * @param year The year as a string
 * @param month The month as a string (1-12)
 * @returns The number of days in the specified month and year
 */
export const getDaysInMonth = (year: string, month: string): number => {
  return new Date(Number(year), Number(month), 0).getDate();
};

/**
 * Generates an array of day options for a given month and year
 * @param year The year as a string
 * @param month The month as a string (1-12)
 * @returns Array of day options with value and label
 */
export const generateDayOptions = (
  year: string,
  month: string
): YearOption[] => {
  const daysInMonth = getDaysInMonth(year, month);
  return Array.from({ length: daysInMonth }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));
};

/**
 * Generates an array of month options
 * @returns Array of month options with value and label
 */
export const generateMonthOptions = (): YearOption[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
};

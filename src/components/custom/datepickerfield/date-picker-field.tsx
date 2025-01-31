'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DatePickerFieldProps {
  field: {
    value: Date | null;
    onChange: (date: Date | null) => void;
  };
  label: string;
  placeholder?: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  label,
  placeholder = 'Pick a date',
}) => {
  // State for managing the current date shown in the calendar
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Sync currentDate with field value when it changes
  useEffect(() => {
    if (field.value instanceof Date && !isNaN(field.value.getTime())) {
      setCurrentDate(field.value);
    } else {
      setCurrentDate(new Date());
    }
  }, [field.value]);

  // Get current year and month for the dropdowns
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate years array from 1900 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  // Handle month selection
  const handleMonthChange = (month: number) => {
    // Update the calendar view
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);

    // Update the field value if not a future date
    const selectedDate = new Date(currentYear, month, 1);
    if (selectedDate <= new Date()) {
      field.onChange(selectedDate);
    }
  };

  // Handle year selection
  const handleYearChange = (year: number) => {
    // Update the calendar view
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);

    // Update the field value if not a future date
    const selectedDate = new Date(year, currentMonth, 1);
    if (selectedDate <= new Date()) {
      field.onChange(selectedDate);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className='relative'>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant='outline'
                role='combobox'
                className={cn(
                  'w-full h-10',
                  'px-3 py-2',
                  'flex items-center justify-between',
                  'text-left font-normal',
                  'bg-background',
                  'border border-input hover:bg-accent hover:text-accent-foreground',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value ? (
                  format(field.value, 'MM/dd/yyyy')
                ) : (
                  <span>{placeholder}</span>
                )}
                <CalendarIcon className='h-4 w-4 opacity-50 shrink-0 ml-auto' />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <div className='border-b border-border p-3'>
              <div className='flex items-center justify-between space-x-2'>
                {/* Month Select */}
                <Select
                  value={currentMonth.toString()}
                  onValueChange={(value) => handleMonthChange(parseInt(value))}
                >
                  <SelectTrigger className='w-[140px] h-8'>
                    <SelectValue>{MONTHS[currentMonth]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {MONTHS.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Year Select */}
                <Select
                  value={currentYear.toString()}
                  onValueChange={(value) => handleYearChange(parseInt(value))}
                >
                  <SelectTrigger className='w-[95px] h-8'>
                    <SelectValue>{currentYear}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Calendar */}
            <Calendar
              mode='single'
              selected={field.value || undefined}
              month={currentDate}
              onMonthChange={setCurrentDate}
              onSelect={(date) => {
                field.onChange(date || null);
                setCalendarOpen(false);
              }}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
              className='rounded-b-md'
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerField;

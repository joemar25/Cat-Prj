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
import { forwardRef, useEffect, useState } from 'react';

interface DatePickerFieldProps {
  field: {
    value: Date | string | null;
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

const DatePickerField = forwardRef<HTMLButtonElement, DatePickerFieldProps>(
  ({ field, label, placeholder = 'Please select a date' }, ref) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);

    useEffect(() => {
      let date: Date;
      if (field.value) {
        date =
          typeof field.value === 'string' ? new Date(field.value) : field.value;
        if (!isNaN(date.getTime())) {
          setCurrentDate(date);
          return;
        }
      }
      setCurrentDate(new Date());
    }, [field.value]);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const years = Array.from(
      { length: new Date().getFullYear() - 1900 + 1 },
      (_, i) => new Date().getFullYear() - i
    );

    const handleMonthChange = (month: number) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(month);
      setCurrentDate(newDate);
      const selectedDate = new Date(currentYear, month, 1);
      if (selectedDate <= new Date()) {
        field.onChange(selectedDate);
      }
    };

    const handleYearChange = (year: number) => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(year);
      setCurrentDate(newDate);
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
                  ref={ref}
                  variant='outline'
                  role='combobox'
                  className={cn(
                    // Replicating the select trigger focus styling
                    'w-full h-10 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value && !isNaN(new Date(field.value).getTime()) ? (
                    format(new Date(field.value), 'MM/dd/yyyy')
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
                  {/* Month Selector */}
                  <Select
                    value={currentMonth.toString()}
                    onValueChange={(value) =>
                      handleMonthChange(parseInt(value))
                    }
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
                  {/* Year Selector */}
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
              <Calendar
                mode='single'
                selected={
                  typeof field.value === 'string'
                    ? new Date(field.value)
                    : field.value || undefined
                }
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
  }
);

DatePickerField.displayName = 'DatePickerField';
export default DatePickerField;

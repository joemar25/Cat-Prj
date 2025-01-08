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
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
  };
  label: string;
  placeholder?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  label,
  placeholder = 'Pick a date',
}) => {
  // State for current month displayed in the calendar
  const [currentDate, setCurrentDate] = useState<Date>(
    field.value || new Date()
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Update currentDate when field.value changes
  useEffect(() => {
    if (field.value) {
      setCurrentDate(field.value);
    }
  }, [field.value]);

  // Get current year and month for dropdowns
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate years from 1900 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1900 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
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
                  format(field.value, 'MMMM do, yyyy')
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
                <Select
                  value={currentMonth.toString()}
                  onValueChange={(value) => handleMonthChange(parseInt(value))}
                >
                  <SelectTrigger className='w-[140px] h-8'>
                    <SelectValue>{format(currentDate, 'MMMM')}</SelectValue>
                  </SelectTrigger>
                  <SelectContent position='popper'>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {format(new Date(2000, i, 1), 'MMMM')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              selected={field.value}
              month={currentDate}
              onMonthChange={setCurrentDate}
              onSelect={(date) => {
                field.onChange(date);
                setCalendarOpen(false);
              }}
              disabled={(date: Date): boolean =>
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

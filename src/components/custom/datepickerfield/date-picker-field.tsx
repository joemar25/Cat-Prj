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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';

interface DatePickerFieldProps {
  field: {
    value: Date | null; // Changed to allow null
    onChange: (date: Date | null) => void; // Changed to allow null
  };
  label: string;
  placeholder?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  label,
  placeholder = 'Pick a date',
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

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
            <Calendar
              mode='single'
              selected={field.value || undefined} // Convert null to undefined for Calendar
              onSelect={(date) => {
                field.onChange(date || null); // Convert undefined to null
                setCalendarOpen(false);
              }}
              disabled={(date) => date > new Date()} // Disable future dates
              initialFocus
              className='rounded-md'
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default DatePickerField;

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Clock } from 'lucide-react';
import { forwardRef, useState } from 'react';

interface TimePickerProps {
  value: Date | null; // Date object or null
  onChange: (value: Date | null) => void;
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  ({ value, onChange }, ref) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    // Convert Date object to HH:MM string format
    const formatDateToTimeString = (date: Date | null): string => {
      if (!date) return '';
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Convert HH:MM string format to Date object
    const parseTimeStringToDate = (time: string): Date | null => {
      if (!time) return null;
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    };

    // Convert 24-hour format (HH:MM) to 12-hour format (HH:MM AM/PM)
    const formatTimeTo12Hour = (time: string) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    // Handle time change
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const timeString = e.target.value;
      const date = parseTimeStringToDate(timeString);
      onChange(date);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-start text-left font-normal'
          >
            <Clock className='mr-2 h-4 w-4' />
            {value
              ? formatTimeTo12Hour(formatDateToTimeString(value))
              : 'Select time'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-2'>
          <Input
            type='time'
            value={formatDateToTimeString(value)}
            onChange={handleTimeChange}
            className='border-0'
            ref={ref} // Forward the ref here
          />
        </PopoverContent>
      </Popover>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export default TimePicker;

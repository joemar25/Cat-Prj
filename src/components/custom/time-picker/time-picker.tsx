import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Clock, X } from 'lucide-react';
import { useState } from 'react';

interface TimePickerProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Convert 24-hour format (HH:MM) to 12-hour format (HH:MM AM/PM)
  const formatTimeTo12Hour = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Clear the selected time
  const handleClearTime = () => {
    onChange('');
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='w-full justify-between text-left font-normal'
        >
          <div className='flex items-center'>
            <Clock className='mr-2 h-4 w-4' />
            {value ? formatTimeTo12Hour(value) : 'Select time'}
          </div>
          {value && (
            <X
              className='h-4 w-4 text-muted-foreground hover:text-foreground'
              onClick={(e) => {
                e.stopPropagation(); // Prevent popover from opening
                handleClearTime();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-2'>
        <Input
          type='time'
          value={value}
          onChange={handleTimeChange}
          className='border-0'
        />
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;

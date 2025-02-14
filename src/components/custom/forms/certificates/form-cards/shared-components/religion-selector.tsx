import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { religions } from '@/lib/constants/religions';
import { forwardRef, useState } from 'react';

export interface ReligionSelectorProps {
  label?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  name?: string;
}

const ReligionSelector = forwardRef<HTMLButtonElement, ReligionSelectorProps>(
  (
    { label, value, onValueChange, placeholder = 'Select religion', name },
    ref
  ) => {
    const [isInputMode, setIsInputMode] = useState(false);

    const handleSelectChange = (newValue: string) => {
      if (newValue === 'Others') {
        setIsInputMode(true);
        onValueChange?.(''); // Clear value to allow user input
      } else {
        setIsInputMode(false);
        onValueChange?.(newValue);
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
    };

    const handleBackClick = () => {
      setIsInputMode(false);
      onValueChange?.('');
    };

    return (
      <div className='space-y-1'>
        {label && (
          <label
            htmlFor={name}
            className='block text-sm font-medium text-gray-700'
          >
            {label}
          </label>
        )}
        <div className='space-y-2'>
          {!isInputMode ? (
            <Select
              value={religions.includes(value || '') ? value : ''}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id={name} ref={ref} className='h-10'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {religions.map((religion) => (
                  <SelectItem key={religion} value={religion}>
                    {religion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className='flex space-x-2'>
              <Input
                value={value || ''}
                onChange={handleInputChange}
                placeholder='Please specify your religion'
                className='flex-1'
              />
              <button
                type='button'
                onClick={handleBackClick}
                className='px-3 py-2 text-sm text-gray-600 hover:text-gray-800'
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReligionSelector.displayName = 'ReligionSelector';

export default ReligionSelector;

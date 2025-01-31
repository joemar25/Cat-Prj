'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormType } from '@prisma/client';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import LocationSelector from './location-selector';
import NCRModeSwitch from './ncr-mode-switch';

interface RegistryInformationCardProps {
  formType: FormType;
  title?: string;
}

const RegistryInformationCard: React.FC<RegistryInformationCardProps> = ({
  formType,
  title = 'Registry Information',
}) => {
  const { control, setValue, setError, clearErrors } = useFormContext();
  const [registryNumber, setRegistryNumber] = useState('');
  const [debouncedRegistryNumber] = useDebounce(registryNumber, 500);
  const [isChecking, setIsChecking] = useState(false);
  const [isNCRMode, setIsNCRMode] = useState(false);

  const [validationResult, setValidationResult] = useState<{
    exists: boolean | null;
    error: string | null;
  }>({ exists: null, error: null });

  const validateRegistryNumber = useCallback(
    (value: string): string => {
      if (!value) return '';

      const formatRegex =
        formType === FormType.MARRIAGE ? /^\d{4}-\d{5}$/ : /^\d{4}-\d+$/;

      if (!value.match(formatRegex)) {
        if (value.length < (formType === FormType.MARRIAGE ? 10 : 6)) return '';
        return `Registry number must be in format: ${
          formType === FormType.MARRIAGE ? 'YYYY-#####' : 'YYYY-numbers'
        }`;
      }

      const year = parseInt(value.split('-')[0]);
      const currentYear = new Date().getFullYear();
      if (year < 1945 || year > currentYear) {
        return 'Registration year must be between 1945 and current year';
      }

      if (formType === FormType.MARRIAGE) {
        const sequence = parseInt(value.split('-')[1]);
        if (sequence <= 0 || sequence > 99999) {
          return 'Sequence number must be between 1 and 99999';
        }
      }

      return '';
    },
    [formType]
  );

  const checkRegistryNumber = useCallback(
    async (value: string) => {
      try {
        setIsChecking(true);

        const response = await fetch('/api/check-registry-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registryNumber: value, formType }),
        });

        if (!response.ok) {
          throw new Error('Failed to validate registry number');
        }

        const { exists } = await response.json();

        if (exists) {
          setError('registryNumber', {
            type: 'manual',
            message: 'This registry number is already in use.',
          });
          setValidationResult({ exists: true, error: null });
        } else {
          clearErrors('registryNumber');
          setValidationResult({ exists: false, error: null });
        }
      } catch (error) {
        console.error('Validation error:', error);
        setValidationResult({
          exists: null,
          error: 'Failed to validate registry number. Please try again.',
        });
      } finally {
        setIsChecking(false);
      }
    },
    [setError, clearErrors, formType]
  );

  useEffect(() => {
    if (
      debouncedRegistryNumber.length >=
      (formType === FormType.MARRIAGE ? 10 : 6)
    ) {
      const error = validateRegistryNumber(debouncedRegistryNumber);
      if (!error) {
        checkRegistryNumber(debouncedRegistryNumber);
      }
    } else {
      clearErrors('registryNumber');
      setValidationResult({ exists: null, error: null });
    }
  }, [
    debouncedRegistryNumber,
    checkRegistryNumber,
    clearErrors,
    validateRegistryNumber,
    formType,
  ]);

  const handleRegistryNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value.replace(/[^\d-]/g, '');

    if (value.length >= 4 && !value.includes('-')) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }

    const error = validateRegistryNumber(value);
    if (error) {
      setError('registryNumber', {
        type: 'manual',
        message: error,
      });
    } else {
      clearErrors('registryNumber');
    }

    setRegistryNumber(value);
    setValue('registryNumber', value);
  };

  const getValidationIcon = () => {
    if (isChecking) {
      return <Loader2 className='h-4 w-4 animate-spin text-yellow-500' />;
    }
    if (validationResult.error) {
      return <AlertCircle className='h-4 w-4 text-red-500' />;
    }
    if (validationResult.exists === false) {
      return <CheckCircle2 className='h-4 w-4 text-green-500' />;
    }
    if (validationResult.exists === true) {
      return <AlertCircle className='h-4 w-4 text-red-500' />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* add here the ncr-mode-swticht */}
        <NCRModeSwitch isNCRMode={isNCRMode} setIsNCRMode={setIsNCRMode} />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <FormField
            control={control}
            name='registryNumber'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Registry Number</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      className='h-10 pr-8'
                      placeholder={
                        formType === FormType.MARRIAGE
                          ? 'YYYY-#####'
                          : 'YYYY-numbers'
                      }
                      {...field}
                      onChange={handleRegistryNumberChange}
                      value={field.value || ''}
                      maxLength={formType === FormType.MARRIAGE ? 10 : 20}
                      inputMode='numeric'
                    />
                  </FormControl>
                  <div className='absolute right-2 top-[10px]'>
                    {getValidationIcon()}
                  </div>
                </div>
                <FormDescription>
                  Format:{' '}
                  {formType === FormType.MARRIAGE
                    ? 'YYYY-##### (e.g., 2025-00001)'
                    : 'YYYY-numbers (e.g., 2025-123456)'}
                </FormDescription>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <LocationSelector isNCRMode={isNCRMode} className='col-span-2' />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistryInformationCard;

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';

const RegistryInformationCard: React.FC = () => {
  const { control, setValue, setError, clearErrors } = useFormContext();
  const [registryNumber, setRegistryNumber] = useState('');
  const [debouncedRegistryNumber] = useDebounce(registryNumber, 500); // Increased debounce time
  const [isChecking, setIsChecking] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    exists: boolean | null;
    error: string | null;
  }>({ exists: null, error: null });

  const [selectedProvince, setSelectedProvince] = useState('');
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [municipalities, setMunicipalities] = useState<string[]>([]);

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const allProvinces = await getAllProvinces();
        setProvinces(allProvinces);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Update municipalities when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchMunicipalities = async () => {
        try {
          const cities = getCitiesMunicipalities(selectedProvince);
          setMunicipalities(cities);
        } catch (error) {
          console.error('Failed to fetch municipalities:', error);
        }
      };

      fetchMunicipalities();
    } else {
      setMunicipalities([]);
    }
  }, [selectedProvince]);

  // Memoized checkRegistryNumber function
  const checkRegistryNumber = useCallback(
    async (value: string) => {
      try {
        setIsChecking(true);

        const response = await fetch('/api/check-registry-number', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registryNumber: value, formType: 'BIRTH' }),
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
    [setError, clearErrors]
  );

  // Validate the registry number on debounce
  useEffect(() => {
    if (debouncedRegistryNumber.length >= 6) {
      // Minimum length for validation (e.g., 2025-1)
      checkRegistryNumber(debouncedRegistryNumber);
    } else {
      clearErrors('registryNumber');
      setValidationResult({ exists: null, error: null });
    }
  }, [debouncedRegistryNumber, checkRegistryNumber, clearErrors]);

  const handleRegistryNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value.replace(/[^\d-]/g, ''); // Ensure numeric input

    if (value.length >= 4 && !value.includes('-')) {
      value = value.slice(0, 4) + '-' + value.slice(4); // Auto-format to YYYY-numbers
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
        <CardTitle>Registry Information</CardTitle>
      </CardHeader>
      <CardContent>
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
                      placeholder='YYYY-numbers'
                      {...field}
                      onChange={handleRegistryNumberChange}
                      value={field.value || ''}
                      maxLength={20} // Optional: Prevent excessively long inputs
                      inputMode='numeric'
                    />
                  </FormControl>
                  <div className='absolute right-2 top-[10px]'>
                    {getValidationIcon()}
                  </div>
                </div>
                <FormDescription>
                  Format: YYYY-numbers (e.g., 2025-123456)
                </FormDescription>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = provinces.find(
                      (province) => province.id === value
                    );
                    field.onChange(selected?.name || '');
                    setSelectedProvince(value);
                    setValue('province', selected?.name || '');
                  }}
                  value={
                    provinces.find((province) => province.name === field.value)
                      ?.id || ''
                  }
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select province' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                  disabled={!selectedProvince}
                >
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select city/municipality' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {municipalities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistryInformationCard;

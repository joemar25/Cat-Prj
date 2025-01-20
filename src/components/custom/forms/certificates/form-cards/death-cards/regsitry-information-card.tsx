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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  checkRegistryNumberExists,
  generateRegistryNumber,
} from '@/hooks/form-certificate-actions';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import { FormType } from '@prisma/client';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const RegistryInformationCard: React.FC = () => {
  const { control, setValue, setError, clearErrors } =
    useFormContext<DeathCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckedValue, setLastCheckedValue] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  // Enhanced registry number generation with retries
  const fetchRegistryNumber = useCallback(async () => {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        setIsLoading(true);
        const number = await generateRegistryNumber(FormType.DEATH);
        setValue('registryNumber', number);
        clearErrors('registryNumber');
        return;
      } catch (error) {
        retries++;
        if (retries === MAX_RETRIES) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Failed to generate registry number');
          }
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }, [setValue, clearErrors]);

  useEffect(() => {
    if (isAutomatic) {
      fetchRegistryNumber().finally(() => setIsLoading(false));
    }
  }, [isAutomatic, fetchRegistryNumber]);

  // Format manual input to match YYYY-##### pattern
  const formatRegistryNumber = useCallback((value: string) => {
    const cleaned = value.replace(/[^\d-]/g, '');
    const parts = cleaned.split('-');
    const year = parts[0]?.slice(0, 4) || '';
    const sequence = parts[1]?.slice(0, 5) || '';

    if (year.length === 4 && !cleaned.includes('-') && year === parts[0]) {
      return `${year}-${sequence}`;
    }

    if (year && sequence) {
      return `${year}-${sequence}`;
    }

    return cleaned;
  }, []);

  // Enhanced validation with proper error handling
  const validateRegistryNumber = useCallback((value: string): string => {
    if (!value) return '';

    if (!value.match(/^\d{4}-\d{5}$/)) {
      if (value.length < 10) return '';
      return 'Registry number must be in format: YYYY-#####';
    }

    const year = parseInt(value.split('-')[0]);
    const currentYear = new Date().getFullYear();
    if (year < 1945 || year > currentYear) {
      return 'Registration year must be between 1945 and current year';
    }

    const sequence = parseInt(value.split('-')[1]);
    if (sequence <= 0 || sequence > 99999) {
      return 'Sequence number must be between 1 and 99999';
    }

    return '';
  }, []);

  // Enhanced registry number check with proper state management
  const checkRegistryNumberDebounced = useMemo(
    () =>
      debounce(async (value: string) => {
        if (!value.match(/^\d{4}-\d{5}$/)) return;
        if (value === lastCheckedValue) return;

        setIsChecking(true);
        try {
          await checkRegistryNumberExists(value, FormType.DEATH);
          clearErrors('registryNumber');
          setLastCheckedValue(value);
        } catch (error) {
          if (error instanceof Error) {
            setError('registryNumber', {
              type: 'manual',
              message: error.message,
            });
            toast.error(error.message);
          }
        } finally {
          setIsChecking(false);
        }
      }, 500),
    [lastCheckedValue, setError, clearErrors]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      checkRegistryNumberDebounced.cancel();
    };
  }, [checkRegistryNumberDebounced]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='auto-registry'
              checked={isAutomatic}
              disabled={isLoading}
              onCheckedChange={(checked) => {
                setIsAutomatic(checked);
                if (!checked) {
                  setValue('registryNumber', '');
                  clearErrors('registryNumber');
                  setLastCheckedValue('');
                } else {
                  setIsLoading(true);
                }
              }}
            />
            <Label htmlFor='auto-registry'>
              {isAutomatic ? 'Automatic' : 'Manual'} Registry Number
            </Label>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              control={control}
              name='registryNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registry Number</FormLabel>
                  <FormControl>
                    <Input
                      className='h-10'
                      placeholder={isAutomatic ? 'Loading...' : 'YYYY-#####'}
                      disabled={isAutomatic || isLoading}
                      readOnly={isAutomatic}
                      maxLength={10}
                      {...field}
                      onChange={(e) => {
                        if (!isAutomatic) {
                          const formatted = formatRegistryNumber(
                            e.target.value
                          );
                          field.onChange(formatted);

                          const error = validateRegistryNumber(formatted);
                          if (error) {
                            setError('registryNumber', {
                              type: 'manual',
                              message: error,
                            });
                          } else if (formatted.length === 10) {
                            checkRegistryNumberDebounced(formatted);
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!isAutomatic && field.value) {
                          const error = validateRegistryNumber(field.value);
                          if (error) {
                            setError('registryNumber', {
                              type: 'manual',
                              message: error,
                            });
                            toast.error(error);
                          } else if (field.value.length < 10) {
                            toast.error('Please complete the registry number');
                          }
                        }
                      }}
                      value={field.value || ''}
                      inputMode='numeric'
                    />
                  </FormControl>
                  {!isAutomatic && (
                    <FormDescription>
                      Format: YYYY-##### (e.g., 2025-00001)
                    </FormDescription>
                  )}
                  {isChecking && (
                    <FormDescription className='text-yellow-600'>
                      Checking registry number...
                    </FormDescription>
                  )}
                  <FormMessage />
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
                      const provinceObj = allProvinces.find(
                        (p) => p.id === value
                      );
                      field.onChange(provinceObj?.name || '');
                      setSelectedProvince(value);
                      // Clear city when province changes
                      setValue('cityMunicipality', '');
                    }}
                    value={
                      allProvinces.find((p) => p.name === field.value)?.id || ''
                    }
                  >
                    <FormControl>
                      <SelectTrigger className='h-10'>
                        <SelectValue placeholder='Select province' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allProvinces.map((province) => (
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
                      {citiesMunicipalities.map((city) => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistryInformationCard;

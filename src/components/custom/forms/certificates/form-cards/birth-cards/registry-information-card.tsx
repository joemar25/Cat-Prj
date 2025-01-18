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
import { generateRegistryNumber } from '@/hooks/form-certificate-actions';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import { FormType } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { checkRegistryNumberExists } from '@/hooks/form-certificate-actions';
import debounce from 'lodash/debounce';

const RegistryInformationCard: React.FC = () => {
  const { control, setValue, setError, clearErrors } =
    useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAutomatic, setIsAutomatic] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  // Automatic registry number generation
  useEffect(() => {
    if (isAutomatic) {
      const fetchRegistryNumber = async () => {
        try {
          setIsLoading(true);
          const number = await generateRegistryNumber(FormType.BIRTH);
          setValue('registryNumber', number);
          clearErrors('registryNumber');
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error('Failed to generate registry number');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchRegistryNumber();
    }
  }, [isAutomatic, setValue, clearErrors]);

  // Format manual input to match YYYY-##### pattern
  const formatRegistryNumber = (value: string) => {
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
  };

  // Debounced registry number check
  const checkRegistryNumberDebounced = debounce(async (value: string) => {
    if (!value.match(/^\d{4}-\d{5}$/)) return;

    setIsChecking(true);
    try {
      await checkRegistryNumberExists(value);
      clearErrors('registryNumber');
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
  }, 500);

  // Validate registry number format
  const validateRegistryNumber = (value: string): string => {
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
  };

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
              onCheckedChange={(checked) => {
                setIsAutomatic(checked);
                if (!checked) {
                  setValue('registryNumber', '');
                  clearErrors('registryNumber');
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
                      disabled={isAutomatic && isLoading}
                      readOnly={isAutomatic}
                      maxLength={10}
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

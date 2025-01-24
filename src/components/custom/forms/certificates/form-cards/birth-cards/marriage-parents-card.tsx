'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import {
  getAllProvinces,
  getCitiesMunicipalities,
} from '@/lib/utils/location-helpers';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const MarriageOfParentsCard: React.FC = () => {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [selectedProvince, setSelectedProvince] = useState('');

  const allProvinces = getAllProvinces();
  const citiesMunicipalities = getCitiesMunicipalities(selectedProvince);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marriage of Parents</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Marriage Date Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Date of Marriage</h3>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name='parentMarriage.date'
              render={({ field }) => {
                const dateValue = field.value
                  ? new Date(field.value.split('/').reverse().join('-'))
                  : undefined;

                return (
                  <DatePickerField
                    field={{
                      value: dateValue,
                      onChange: (date) => {
                        if (date) {
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, '0');
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, '0');
                          const year = date.getFullYear();
                          field.onChange(`${month}/${day}/${year}`);
                        } else {
                          field.onChange('');
                        }
                      },
                    }}
                    label='Marriage Date'
                    placeholder='Select marriage date'
                  />
                );
              }}
            />
          </CardContent>
        </Card>

        {/* Marriage Place Section */}
        <Card>
          <CardHeader className='pb-3'>
            <h3 className='text-sm font-semibold'>Place of Marriage</h3>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={control}
                name='parentMarriage.place.province'
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
                        allProvinces.find((p) => p.name === field.value)?.id ||
                        ''
                      }
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
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
                name='parentMarriage.place.cityMunicipality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Municipality</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!selectedProvince}
                    >
                      <FormControl>
                        <SelectTrigger className='h-10 px-3 text-base md:text-sm'>
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
              <FormField
                control={control}
                name='parentMarriage.place.country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        className='h-10'
                        placeholder='Enter country'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MarriageOfParentsCard;

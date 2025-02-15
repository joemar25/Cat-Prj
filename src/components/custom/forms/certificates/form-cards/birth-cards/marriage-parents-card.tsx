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
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

export default function MarriageInformationCard() {
  const { control } = useFormContext<BirthCertificateFormValues>();
  const [ncrMode, setNcrMode] = useState(false);

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold'>
          Marriage Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Marriage Date */}
        <FormField
          control={control}
          name='parentMarriage.date'
          render={({ field }) => (
            <DatePickerField
              field={{
                value: field.value,
                onChange: field.onChange,
              }}
              label='Marriage Date'
              placeholder='Select marriage date'
              ref={field.ref}
            />
          )}
        />

        {/* Marriage Place */}
        <Card className='border'>
          <CardHeader>
            <CardTitle className='text-lg font-medium'>
              Marriage Place
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={control}
                name='parentMarriage.place.houseNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House No.</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter house number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='parentMarriage.place.st'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter street' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* NCR Mode Switch & Location Selector */}
            <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setNcrMode} />
            <LocationSelector
              provinceFieldName='parentMarriage.place.province'
              municipalityFieldName='parentMarriage.place.cityMunicipality'
              barangayFieldName='parentMarriage.place.barangay'
              provinceLabel='Province'
              municipalityLabel='City/Municipality'
              barangayLabel='Barangay'
              isNCRMode={ncrMode}
              showBarangay={true}
              provincePlaceholder='Select province'
              municipalityPlaceholder='Select city/municipality'
              barangayPlaceholder='Select barangay'
            />

            <FormField
              control={control}
              name='parentMarriage.place.country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

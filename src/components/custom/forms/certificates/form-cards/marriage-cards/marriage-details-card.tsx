'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import LocationSelector from '../shared-components/location-selector';
import NCRModeSwitch from '../shared-components/ncr-mode-switch';

const MarriageDetailsCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();
  const [ncrMode, setncrMode] = useState(false);

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Marriage Details</CardTitle>
      </CardHeader>
      <CardContent className='p-6 space-y-4'>
        <div className='col-span-1 md:col-span-3'>
          <NCRModeSwitch isNCRMode={ncrMode} setIsNCRMode={setncrMode} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4'>
          {/* Place of Birth */}
          <LocationSelector
            provinceFieldName='marriageDetails.placeOfMarriage.province'
            municipalityFieldName='marriageDetails.placeOfMarriage.cityMunicipality'
            barangayFieldName='marriageDetails.placeOfMarriage.barangay'
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
            name='marriageDetails.placeOfMarriage.country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input className='h-10' placeholder='Enter country '
                    {...field}
                    value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Marriage */}
          <FormField
            control={control}
            name='marriageDetails.dateOfMarriage'
            render={({ field }) => (
              <DatePickerField field={{
                value: field.value || '',
                onChange: field.onChange
              }}
                label='Date of Marriage'
                ref={field.ref}
                placeholder='Select date of marriage'
              />
            )}
          />

          {/* Time of Marriage */}
          <FormField
            control={control}
            name='marriageDetails.timeOfMarriage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Marriage</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    type='time'
                    placeholder='Enter time of marriage'

                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarriageDetailsCard;

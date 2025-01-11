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
import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const MarriageDetailsCard: React.FC = () => {
  const { control } = useFormContext<MarriageCertificateFormValues>();

  return (
    <Card className='border dark:border-border'>
      <CardHeader>
        <CardTitle>Marriage Details</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Place of Marriage */}
          <FormField
            control={control}
            name='placeOfMarriage.office'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Marriage</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter office/church/mosque name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* City/Municipality */}
          <FormField
            control={control}
            name='placeOfMarriage.cityMunicipality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City/Municipality</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter city/municipality'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Province */}
          <FormField
            control={control}
            name='placeOfMarriage.province'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter province'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Date of Marriage */}
          <FormField
            control={control}
            name='dateOfMarriage'
            render={({ field }) => (
              <DatePickerField field={field} label='Date of Marriage' />
            )}
          />
          {/* Time of Marriage */}
          <FormField
            control={control}
            name='timeOfMarriage'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Marriage</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    type='time'
                    placeholder='Enter time of marriage'
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
  );
};

export default MarriageDetailsCard;

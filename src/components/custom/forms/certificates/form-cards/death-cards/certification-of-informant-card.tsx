'use client';

import DatePickerField from '@/components/custom/datepickerfield/date-picker-field';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CertificationInformantCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <h3 className='text-sm font-semibold'>Certification of Informant</h3>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          {/* Signature */}
          <FormField
            control={control}
            name='informant.signature'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Signature</FormLabel>
                <FormControl>
                  <Input
                    className='h-10'
                    placeholder='Enter signature'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}
          <FormField
            control={control}
            name='informant.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className='h-10' placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Relationship to Deceased */}
        <FormField
          control={control}
          name='informant.relationship'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship to the Deceased</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Enter relationship'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={control}
          name='informant.address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Enter street address'
                  value={field.value ? JSON.stringify(field.value) : ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informant Date */}
        <FormField
          control={control}
          name='informant.date'
          render={({ field }) => (
            <FormItem>
              <DatePickerField
                field={{
                  value: field.value ?? null,
                  onChange: field.onChange,
                }}
                label='Date'
                placeholder='Select date'
              />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationInformantCard;

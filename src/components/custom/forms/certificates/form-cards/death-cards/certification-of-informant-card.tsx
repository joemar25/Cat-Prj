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
import { parseToDate } from '@/utils/date';
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
                  placeholder='Enter address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={control}
          name='informant.date'
          render={({ field }) => {
            const dateValue = field.value
              ? (() => {
                  const [month, day, year] = field.value.split('/');
                  return parseToDate(year, month, day);
                })()
              : undefined;

            return (
              <FormItem>
                <DatePickerField
                  field={{
                    value: dateValue || undefined,
                    onChange: (date) => {
                      if (date) {
                        const month = (date.getMonth() + 1)
                          .toString()
                          .padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const year = date.getFullYear();
                        field.onChange(`${month}/${day}/${year}`);
                      } else {
                        field.onChange('');
                      }
                    },
                  }}
                  label='Date'
                  placeholder='Select date'
                />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CertificationInformantCard;

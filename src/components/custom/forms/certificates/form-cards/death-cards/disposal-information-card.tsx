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
import { Textarea } from '@/components/ui/textarea';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const DisposalInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader className='pb-3'>
        <h3 className='text-sm font-semibold'>Disposal Information</h3>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Method of Disposal */}
        <FormField
          control={control}
          name='disposal.method'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Method of Disposal</FormLabel>
              <FormControl>
                <Input
                  className='h-10'
                  placeholder='Burial, Cremation, etc.'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Burial/Cremation Permit Section */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Burial/Cremation Permit</h4>
            <FormField
              control={control}
              name='disposal.burialPermit.number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input
                      className='h-10'
                      placeholder='Enter permit number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Burial Permit Date Issued */}
            <FormField
              control={control}
              name='disposal.burialPermit.dateIssued'
              render={({ field }) => (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: field.value,
                      onChange: field.onChange,
                    }}
                    label='Date Issued'
                    placeholder='Select date issued'
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Transfer Permit Section */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Transfer Permit</h4>
            <FormField
              control={control}
              name='disposal.transferPermit.number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permit Number</FormLabel>
                  <FormControl>
                    <Input
                      className='h-10'
                      placeholder='Enter permit number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Transfer Permit Date Issued */}
            <FormField
              control={control}
              name='disposal.transferPermit.dateIssued'
              render={({ field }) => (
                <FormItem>
                  <DatePickerField
                    field={{
                      value: field.value ?? null, // Convert undefined to null
                      onChange: (date) => field.onChange(date),
                    }}
                    label='Date Issued'
                    placeholder='Select date issued'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Cemetery or Crematory Information */}
        <FormField
          control={control}
          name='disposal.cemeteryAddress'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name and Address of Cemetery or Crematory</FormLabel>
              <FormControl>
                <Textarea
                  className='h-20'
                  placeholder='Enter name and address'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default DisposalInformationCard;

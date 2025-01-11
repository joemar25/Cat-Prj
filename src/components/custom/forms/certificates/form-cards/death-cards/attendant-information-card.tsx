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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const AttendantInformationCard: React.FC = () => {
  const { control } = useFormContext<DeathCertificateFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendant Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <FormField
          control={control}
          name='attendant.type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Attendant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select attendant type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Private Physician'>
                    Private Physician
                  </SelectItem>
                  <SelectItem value='Public Health Officer'>
                    Public Health Officer
                  </SelectItem>
                  <SelectItem value='Hospital Authority'>
                    Hospital Authority
                  </SelectItem>
                  <SelectItem value='None'>None</SelectItem>
                  <SelectItem value='Others'>Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='attendant.duration.from'
            render={({ field }) => (
              <FormItem>
                <DatePickerField field={field} label='From' />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='attendant.duration.to'
            render={({ field }) => (
              <FormItem>
                <DatePickerField field={field} label='To' />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendantInformationCard;

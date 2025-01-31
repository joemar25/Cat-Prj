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
import { CIVIL_REGISTRAR_STAFF } from '@/lib/constants/civil-registrar-staff';
import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const ReceivedByCard: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitted },
  } = useFormContext<BirthCertificateFormValues>();
  const selectedName = watch('receivedBy.name');

  // Auto-fill title when name is selected
  useEffect(() => {
    const staff = CIVIL_REGISTRAR_STAFF.find(
      (staff) => staff.name === selectedName
    );
    if (staff) {
      setValue('receivedBy.title', staff.title, {
        shouldValidate: isSubmitted,
        shouldDirty: true,
      });
    }
  }, [selectedName, setValue, isSubmitted]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Received By</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Signature */}
        <FormField
          control={control}
          name='receivedBy.signature'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature</FormLabel>
              <FormControl>
                <Input placeholder='Signature' {...field} className='h-10' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name and Title */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='receivedBy.name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name in Print</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Select staff name' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CIVIL_REGISTRAR_STAFF.map((staff) => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name}
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
            name='receivedBy.title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title or Position</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Title will auto-fill'
                    {...field}
                    className='h-10'
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Received By Date */}
        <FormField
          control={control}
          name='receivedBy.date'
          render={({ field }) => (
            <DatePickerField
              field={{
                value: field.value,
                onChange: field.onChange,
              }}
              label='Date'
              placeholder='Select date'
            />
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ReceivedByCard;
